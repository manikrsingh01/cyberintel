import React, { useState, useEffect } from "react";
import { TelemetryTrace } from "@/lib/types";
import { getTraces } from "@/lib/telemetry";
import { X, Activity, DollarSign, Clock, Hash, CheckCircle2, ShieldCheck, Terminal } from "lucide-react";

interface TelemetryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryDrawer: React.FC<TelemetryProps> = ({ isOpen, onClose }) => {
  const [traces, setTraces] = useState<TelemetryTrace[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTraces(getTraces());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalTokens = traces.reduce((acc, t) => acc + t.input_tokens + t.output_tokens, 0);
  const totalCost = traces.reduce((acc, t) => acc + t.cost_usd, 0);
  const avgLatency = traces.length > 0
    ? Math.round(traces.reduce((acc, t) => acc + t.latency_ms, 0) / traces.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#0E131F] border-l border-[#1E2638] h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#1E2638] bg-[#111622] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Observability & Tracing
              </span>
              <span className="text-xs text-slate-400">JSONL Telemetry Schema</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-amber-400" />
              <span>Live LLM Traces & Cost Monitor</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#0A0D14] hover:bg-[#1E2638] text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Aggregate Stats Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#0A0D14] border-b border-[#1E2638]">
          <div className="p-3 rounded-lg bg-[#111622] border border-[#1E2638]">
            <p className="text-[11px] text-slate-400 font-medium">Session Cost</p>
            <p className="text-base font-bold text-emerald-400 mt-0.5 font-mono">
              ${totalCost.toFixed(5)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#111622] border border-[#1E2638]">
            <p className="text-[11px] text-slate-400 font-medium">Tokens Burned</p>
            <p className="text-base font-bold text-sky-400 mt-0.5 font-mono">
              {totalTokens.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#111622] border border-[#1E2638]">
            <p className="text-[11px] text-slate-400 font-medium">Avg Latency</p>
            <p className="text-base font-bold text-amber-400 mt-0.5 font-mono">
              {avgLatency} ms
            </p>
          </div>
        </div>

        {/* Traces List */}
        <div className="p-6 flex-1 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Invocation Log ({traces.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Schema: traces.jsonl</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {traces.map((trace) => (
              <div
                key={trace.id}
                className="p-4 rounded-xl bg-[#111622] border border-[#1E2638] space-y-2 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-sky-400 font-bold">{trace.feature}</span>
                  <span className="text-slate-500">{new Date(trace.timestamp).toLocaleTimeString()}</span>
                </div>

                <p className="text-slate-200 font-sans text-xs">
                  <strong className="text-white">{trace.company_name}</strong>: {trace.decision_summary}
                </p>

                <div className="pt-2 border-t border-[#1E2638]/70 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#0A0D14] border border-[#1E2638] text-slate-300">
                      {trace.model}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {trace.prompt_version}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{trace.input_tokens + trace.output_tokens} tok</span>
                    <span>{trace.latency_ms}ms</span>
                    <span className="text-emerald-400 font-bold">${trace.cost_usd.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E2638] bg-[#111622] flex items-center justify-between text-xs text-slate-400">
          <span>Production Cost Ceiling: $50/mo per rep</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0A0D14] hover:bg-[#1E2638] text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
