import type { ReactNode } from "react";
import { Sidebar } from "../../components/sidebar";

export default function ExperimentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* SRM IST Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-white">QuantumLab</h1>
              <p className="text-sm text-white/60">SRM Institute of Science and Technology</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Virtual Quantum Computing Laboratory</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
          <Sidebar />
          <main className="flex-1 space-y-6">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-6 py-3 text-center">
          <p className="text-xs text-white/50">
            Created by <span className="text-blue-400 font-semibold">V Anbuchelban</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

