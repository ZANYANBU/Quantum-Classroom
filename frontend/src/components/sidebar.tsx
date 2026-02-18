"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Sparkles } from "lucide-react";
import { experiments } from "../lib/experiments";
import { cn } from "../lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col gap-6 border-r border-white/10 bg-slate-950/60 px-4 py-6">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-cyan-500/15 p-2 text-cyan-300 ring-1 ring-cyan-500/30">
          <FlaskConical size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">QuantumLab</p>
          <p className="text-base font-semibold text-slate-100">Virtual Workbench</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>Experiments</span>
          <Sparkles size={14} className="text-cyan-300" />
        </div>
        <nav className="space-y-1">
          {experiments.map((exp) => {
            const active = pathname.includes(`/experiments/${exp.slug}`);
            return (
              <Link
                key={exp.slug}
                href={`/experiments/${exp.slug}`}
                className={cn(
                  "flex items-start gap-2 rounded-lg px-3 py-2 transition-colors",
                  active
                    ? "bg-cyan-500/15 text-slate-50 ring-1 ring-cyan-400/40"
                    : "text-slate-300 hover:bg-white/5"
                )}
              >
                <span className="mt-0.5 text-xs font-semibold text-cyan-200">
                  {exp.id.toString().padStart(2, "0")}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{exp.title}</p>
                  <p className="text-xs text-slate-400">{exp.aim}</p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
