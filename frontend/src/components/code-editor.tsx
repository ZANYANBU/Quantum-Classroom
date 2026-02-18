"use client";

import dynamic from "next/dynamic";
import * as React from "react";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-white/10 bg-slate-900/70">
      <MonacoEditor
        width="100%"
        height="420"
        language="python"
        theme="vs-dark"
        value={value}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={(v) => onChange(v || "")}
      />
    </div>
  );
}
