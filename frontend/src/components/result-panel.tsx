"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type ExecutionResult = {
  stdout: string;
  result: unknown;
  error?: string | null;
};

function isCountsObject(result: unknown): result is Record<string, number> {
  if (!result || typeof result !== "object" || Array.isArray(result)) return false;
  const entries = Object.entries(result);
  if (entries.length === 0) return false;
  // Check if all keys are binary strings and all values are numbers
  return entries.every(
    ([k, v]) => typeof v === "number" && /^[01]+$/.test(k)
  );
}

function isValidationResults(result: unknown): result is Record<string, unknown> {
  if (!result || typeof result !== "object" || Array.isArray(result)) return false;
  const obj = result as Record<string, unknown>;
  // Check if it contains validation-like keys
  return Object.keys(obj).some(k => 
    k.includes("correct") || 
    k.includes("success") || 
    k.includes("verified") ||
    k.includes("expected")
  );
}

function isComplexNumber(val: unknown): val is { real: number; imag: number } {
  if (!val || typeof val !== "object") return false;
  const obj = val as Record<string, unknown>;
  return "real" in obj && "imag" in obj && 
         typeof obj.real === "number" && typeof obj.imag === "number";
}

function formatComplexArray(arr: unknown[]): string {
  return arr.map(item => {
    if (isComplexNumber(item)) {
      const { real, imag } = item;
      // Format complex number
      if (Math.abs(imag) < 1e-10) return real.toFixed(3);
      if (Math.abs(real) < 1e-10) return `${imag.toFixed(3)}i`;
      const sign = imag >= 0 ? "+" : "";
      return `${real.toFixed(3)}${sign}${imag.toFixed(3)}i`;
    }
    return String(item);
  }).join(", ");
}

function isVector(result: unknown): result is Array<number | string> {
  return Array.isArray(result) && result.every((v) => typeof v === "number" || typeof v === "string");
}

export function ResultPanel({ data }: { data: ExecutionResult | null }) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Simulation & Results</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-400">Run a simulation to see output.</CardContent>
      </Card>
    );
  }

  const { result, stdout, error } = data;

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Simulation & Results</CardTitle>
        {error ? <Badge className="border-red-400/60 bg-red-500/10 text-red-200">Error</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {stdout ? (
          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3 text-sm text-slate-200">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">stdout</div>
            <pre className="whitespace-pre-wrap text-xs text-slate-100">{stdout}</pre>
          </div>
        ) : null}

        {result == null ? (
          <p className="text-sm text-slate-400">No result object returned. Ensure your code assigns to the variable `result`.</p>
        ) : isCountsObject(result) ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Measurement Counts
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(result).map(([key, value]) => ({ key, value }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="key" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid #1f2937" }} />
                  <Bar dataKey="value" fill="#06b6d4" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : isValidationResults(result) ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Validation Results
            </div>
            <div className="space-y-2">
              {Object.entries(result as Record<string, unknown>).map(([key, value]) => {
                const isBoolValue = typeof value === "boolean";
                const displayValue = isBoolValue ? (value ? "✓ PASS" : "✗ FAIL") : 
                                    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
                const valueColor = isBoolValue ? (value ? "text-green-300" : "text-red-300") : "text-slate-200";
                
                return (
                  <div key={key} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cyan-200">{key.replace(/_/g, " ")}</span>
                      <span className={`text-sm font-semibold ${valueColor}`}>{displayValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : Array.isArray(result) && result.length > 0 && isComplexNumber(result[0]) ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Statevector (Complex Amplitudes)
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
              <pre className="whitespace-pre-wrap text-xs text-slate-100 font-mono">
                {formatComplexArray(result)}
              </pre>
            </div>
          </div>
        ) : isVector(result) ? (
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Statevector
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
              <pre className="whitespace-pre-wrap text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Result Object
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
              <pre className="whitespace-pre-wrap text-xs text-slate-100">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
