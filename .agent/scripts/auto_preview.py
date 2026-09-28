#!/usr/bin/env python3
"""
Auto Preview - Antigravity Kit
==============================
Manages (start/stop/status) the local development server for previewing the application.

Usage:
    python .agent/scripts/auto_preview.py start [port]
    python .agent/scripts/auto_preview.py stop
    python .agent/scripts/auto_preview.py status
"""

import os
import sys
import time
import json
import signal
import argparse
import subprocess
from pathlib import Path

AGENT_DIR = Path(".agent")
PID_FILE = AGENT_DIR / "preview.pid"
LOG_FILE = AGENT_DIR / "preview.log"

PORT_FILE = AGENT_DIR / "preview.port"

def get_project_root():
    return Path(".").resolve()

def is_running(pid):
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def get_start_command(root, port=3000):
    pkg_file = root / "package.json"
    if pkg_file.exists():
        try:
            with open(pkg_file, 'r') as f:
                data = json.load(f)
            scripts = data.get("scripts", {})
            if "dev" in scripts:
                return "npm run dev"
            elif "start" in scripts:
                return "npm start"
        except Exception:
            pass
    
    if (root / "index.html").exists():
        return f'"{sys.executable}" -m http.server {port}'
    return None

import socket

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_available_port(start_port=8080):
    port = start_port
    while is_port_in_use(port) and port < start_port + 100:
        port += 1
    return port

def start_server(port=None):
    if PID_FILE.exists():
        try:
            pid = int(PID_FILE.read_text().strip())
            if is_running(pid):
                print(f"⚠️  Preview already running (PID: {pid})")
                return
        except:
            pass # Invalid PID file

    root = get_project_root()
    if port is None:
        port = 8080 if is_port_in_use(3000) else 3000
    elif is_port_in_use(port):
        new_port = find_available_port(port + 1)
        print(f"⚠️  Port {port} is in use, switching to {new_port}")
        port = new_port

    cmd = get_start_command(root, port)
    
    if not cmd:
        print("❌ No dev/start script found in package.json, nor index.html for static serving")
        sys.exit(1)
    
    env = os.environ.copy()
    env["PORT"] = str(port)
    
    print(f"🚀 Starting preview on port {port}...")
    
    log_file = open(LOG_FILE, "a")
    process = subprocess.Popen(
        cmd,
        cwd=str(root),
        stdout=log_file,
        stderr=log_file,
        stdin=subprocess.DEVNULL,
        env=env,
        shell=True,
        start_new_session=True
    )
    
    PID_FILE.write_text(str(process.pid))
    PORT_FILE.write_text(str(port))
    time.sleep(0.5)
    print(f"✅ Preview started! (PID: {process.pid})")
    print(f"   Logs: {LOG_FILE}")
    print(f"   URL: http://localhost:{port}")

def stop_server():
    if not PID_FILE.exists():
        print("ℹ️  No preview server found.")
        return

    try:
        pid = int(PID_FILE.read_text().strip())
        if is_running(pid):
            # Try gentle kill first
            os.kill(pid, signal.SIGTERM) if sys.platform != 'win32' else subprocess.call(['taskkill', '/F', '/T', '/PID', str(pid)])
            print(f"🛑 Preview stopped (PID: {pid})")
        else:
            print("ℹ️  Process was not running.")
    except Exception as e:
        print(f"❌ Error stopping server: {e}")
    finally:
        if PID_FILE.exists():
            PID_FILE.unlink()
        if PORT_FILE.exists():
            PORT_FILE.unlink()

def status_server():
    running = False
    pid = None
    port = 3000
    if PORT_FILE.exists():
        try:
            port = int(PORT_FILE.read_text().strip())
        except Exception:
            pass
    url = f"http://localhost:{port}"
    
    if PID_FILE.exists():
        try:
            pid = int(PID_FILE.read_text().strip())
            if is_running(pid):
                running = True
        except:
            pass
            
    print("\n=== Preview Status ===")
    if running:
        print(f"✅ Status: Running")
        print(f"🔢 PID: {pid}")
        print(f"🌐 URL: {url}")
        print(f"📝 Logs: {LOG_FILE}")
    else:
        print("⚪ Status: Stopped")
    print("===================\n")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["start", "stop", "status"])
    parser.add_argument("port", nargs="?", default="3000")
    
    args = parser.parse_args()
    
    if args.action == "start":
        start_server(int(args.port))
    elif args.action == "stop":
        stop_server()
    elif args.action == "status":
        status_server()

if __name__ == "__main__":
    main()
