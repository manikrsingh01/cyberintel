# Skill AI - Agent Skills & Capabilities Kit

A modular collection of AI agent skills, specialist personas, workflows, and automated scripts for Antigravity and AI-assisted development.

---

## 🚀 Quick Start / How to Use

### 1. Install as `.agent` in any project
To give an AI assistant in any new or existing workspace access to all these skills and agents:

```bash
# In your project root:
git clone git@github.com:manikrsingh01/skill_ai.git .agent
```
*(Or if using HTTPS: `git clone https://github.com/manikrsingh01/skill_ai.git .agent`)*

### 2. Add as a Git Submodule (Recommended for version tracking)
```bash
git submodule add git@github.com:manikrsingh01/skill_ai.git .agent
```

### 3. Copy Individual Skills
To selectively copy only specific skills (e.g. `frontend-design`, `clean-code`, `seo-fundamentals`):
```bash
cp -r .agent/skills/frontend-design /path/to/project/.agent/skills/
```

---

## 📁 Repository Structure

```
skill_ai/
├── skills/              # 37+ specialized skills with prompt guides & helper scripts
│   ├── api-patterns/
│   ├── app-builder/
│   ├── architecture/
│   ├── clean-code/
│   ├── database-design/
│   ├── frontend-design/
│   ├── mobile-design/
│   ├── nextjs-react-expert/
│   ├── performance-profiling/
│   ├── python-patterns/
│   ├── seo-fundamentals/
│   ├── systematic-debugging/
│   ├── tailwind-patterns/
│   └── ...
├── agents/              # Multi-agent role definitions & system prompts
│   ├── orchestrator.md
│   ├── frontend-specialist.md
│   ├── backend-specialist.md
│   ├── mobile-developer.md
│   ├── project-planner.md
│   ├── debugger.md
│   └── ...
├── workflows/           # Slash commands & execution playbooks (/plan, /orchestrate, etc.)
├── rules/               # Base operating principles and rule sets (GEMINI.md)
├── scripts/             # Automated audit, verification, and checklist runners
└── ARCHITECTURE.md      # Full architecture map of agents, skills, and routing
```

---

## 🛠 Included Skills Overview

- **Frontend & Web**: `frontend-design`, `nextjs-react-expert`, `tailwind-patterns`, `web-design-guidelines`, `webapp-testing`
- **Backend & Cloud**: `api-patterns`, `database-design`, `nodejs-best-practices`, `python-patterns`, `rust-pro`, `server-management`
- **Architecture & Planning**: `app-builder`, `architecture`, `plan-writing`, `behavioral-modes`, `brainstorming`
- **Quality & Security**: `clean-code`, `code-review-checklist`, `testing-patterns`, `tdd-workflow`, `vulnerability-scanner`, `red-team-tactics`
- **Optimization & SEO**: `performance-profiling`, `seo-fundamentals`, `geo-fundamentals`
- **Mobile Development**: `mobile-design`
