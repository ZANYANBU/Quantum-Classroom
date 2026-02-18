import { create } from "zustand";
import { experiments } from "../lib/experiments";

type CodeMap = Record<string, string>;

type ExperimentStore = {
  selectedSlug: string;
  codeBySlug: CodeMap;
  setSelectedSlug: (slug: string) => void;
  setCode: (slug: string, code: string) => void;
};

const initialCodeBySlug: CodeMap = experiments.reduce((acc, exp) => {
  acc[exp.slug] = exp.code;
  return acc;
}, {} as CodeMap);

export const useExperimentStore = create<ExperimentStore>((set) => ({
  selectedSlug: "exp-1",
  codeBySlug: initialCodeBySlug,
  setSelectedSlug: (slug) => set({ selectedSlug: slug }),
  setCode: (slug, code) =>
    set((state) => ({ codeBySlug: { ...state.codeBySlug, [slug]: code } })),
}));
