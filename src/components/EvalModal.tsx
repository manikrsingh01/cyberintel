import React from "react";
import { X, CheckCircle2, TrendingUp, BarChart2 } from "lucide-react";

interface EvalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvalModal: React.FC<EvalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors animate-modal-enter">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                Quality Benchmark
              </span>
              <span className="text-xs text-slate-500">25 Hand-Labeled Test Accounts</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-sky-500" />
              <span>AI Scoring Accuracy Report</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
          {/* Main Scorecard Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4">Previous v1</th>
                  <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">Production v2</th>
                  <th className="py-3 px-4 text-right">Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Lead Precision (No Junk)</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">76.0%</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">95.0%</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">+19.0%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Lead Recall (No Misses)</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">100.0%</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">100.0%</td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono">0.0%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Balanced F1 Score</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">86.4%</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">97.4%</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">+11.1%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Response Speed</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">380 ms</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">303 ms</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">-77 ms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cost per 10,000 Accounts</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">$1.97</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">$1.57</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">-$0.40</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Simple Explanation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">What was fixed from v1:</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Initial testing revealed the AI was giving local retail bakeries high risk scores. In v2, strict exclusion filters were introduced to eliminate non-tech businesses and huge corporate banks with 300+ in-house security staff.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">Business Impact:</h4>
              <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
                95% precision means sales reps spend zero time reaching out to disqualified accounts, while 100% recall ensures no genuine high-intent opportunities are missed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
