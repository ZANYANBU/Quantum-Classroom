import { Metadata } from "next";
import { notFound } from "next/navigation";
import { experiments, experimentMap } from "../../../lib/experiments";
import { ExperimentWorkspace } from "../../../components/experiment-workspace";
import { Badge } from "../../../components/ui/badge";

export const dynamicParams = false;

export async function generateStaticParams() {
  return experiments.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = experimentMap[slug];
  if (!exp) return { title: "Experiment" };
  return {
    title: `${exp.title} | QuantumLab`,
    description: exp.aim,
  };
}

export default async function ExperimentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = experimentMap[slug];

  if (!experiment) {
    return notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quantum Experiment</p>
          <h1 className="text-3xl font-semibold text-slate-50">{experiment.title}</h1>
          <p className="text-sm text-slate-400">{experiment.aim}</p>
        </div>
        <Badge className="border-purple-400/40 bg-purple-500/10 text-purple-200">
          EXP {experiment.id.toString().padStart(2, "0")}
        </Badge>
      </div>
      <ExperimentWorkspace experiment={experiment} />
    </div>
  );
}
