"use client";

import { useState } from "react";
import { Play, Rocket, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Experiment } from "../lib/experiments";
import { useExperimentStore } from "../store/experiment-store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CodeEditor } from "./code-editor";
import { ResultPanel, type ExecutionResult } from "./result-panel";

async function runRemote(code: string): Promise<ExecutionResult> {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const res = await fetch(`${endpoint}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    return { stdout: "", result: null, error: `HTTP ${res.status}` };
  }

  return (await res.json()) as ExecutionResult;
}

export function ExperimentWorkspace({ experiment }: { experiment: Experiment }) {
  const { codeBySlug, setCode } = useExperimentStore();
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showTheory, setShowTheory] = useState(false);
  const [parameters, setParameters] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    experiment.parameters?.forEach((p) => {
      defaults[p.name] = p.default;
    });
    return defaults;
  });

  const code = codeBySlug[experiment.slug] ?? experiment.code;

  // Replace parameter placeholders in code with actual values
  const getCodeWithParameters = () => {
    let modifiedCode = code;
    experiment.parameters?.forEach((param) => {
      const value = parameters[param.name];
      // Replace parameter references in code (e.g., shots=1024 -> shots=<value>)
      modifiedCode = modifiedCode.replace(
        new RegExp(`${param.name}\\s*=\\s*\\d+`, 'g'),
        `${param.name}=${value}`
      );
    });
    return modifiedCode;
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const codeToRun = experiment.parameters?.length ? getCodeWithParameters() : code;
      const result = await runRemote(codeToRun);
      setOutput(result);
    } catch (error) {
      setOutput({ stdout: "", result: null, error: (error as Error).message });
    } finally {
      setIsRunning(false);
    }
  };

  const handleParameterChange = (name: string, value: number) => {
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-50">
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.6)]" />
                {experiment.title}
              </CardTitle>
              <CardDescription className="mt-1 text-slate-300">Aim: {experiment.aim}</CardDescription>
            </div>
            <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">Theory</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-200">
            <p className="text-slate-300">{experiment.summary}</p>
            
            {/* Theory Section */}
            {experiment.theory && (
              <div className="border-t border-white/10 pt-3">
                <button
                  onClick={() => setShowTheory(!showTheory)}
                  className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  {showTheory ? "Hide Theory" : "Show Theory"}
                  {showTheory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {showTheory && (
                  <div className="mt-3 prose prose-invert prose-sm max-w-none prose-pre:bg-slate-900/70 prose-code:text-cyan-300">
                    <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                      {experiment.theory}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Parameter Controls */}
            {experiment.parameters && experiment.parameters.length > 0 && (
              <div className="border-t border-white/10 pt-3 space-y-3">
                <h3 className="text-sm font-semibold text-cyan-400">Parameters</h3>
                {experiment.parameters.map((param) => (
                  <div key={param.name} className="flex items-center justify-between gap-4">
                    <label htmlFor={param.name} className="text-xs text-slate-400 flex-shrink-0">
                      {param.label}:
                    </label>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="range"
                        id={param.name}
                        min={param.min}
                        max={param.max}
                        value={parameters[param.name]}
                        onChange={(e) => handleParameterChange(param.name, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <input
                        type="number"
                        min={param.min}
                        max={param.max}
                        value={parameters[param.name]}
                        onChange={(e) => handleParameterChange(param.name, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 text-xs bg-slate-900/70 border border-white/10 rounded text-slate-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-slate-400 text-xs border-t border-white/10 pt-3">
              Use the workbench to tweak the Qiskit circuit. Assign your return object to the variable
              <code className="mx-1 rounded bg-slate-900/70 px-1.5 py-0.5 text-xs text-cyan-200">result</code>
              so the simulation panel can visualize it.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-50">Workbench</CardTitle>
              <CardDescription className="text-slate-400">Python (Qiskit) code editor</CardDescription>
            </div>
            <Badge className="border-cyan-400/40 bg-cyan-500/10 text-cyan-100">Editor</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeEditor value={code} onChange={(v) => setCode(experiment.slug, v)} />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Editing updates are kept locally per experiment using Zustand state.
              </p>
              <Button onClick={handleRun} disabled={isRunning} className="shadow-[0_10px_35px_rgba(6,182,212,0.35)]">
                {isRunning ? <Rocket className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Running" : "Run Simulation"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ResultPanel data={output} />
    </div>
  );
}
