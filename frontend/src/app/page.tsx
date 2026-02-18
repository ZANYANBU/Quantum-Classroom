import { redirect } from "next/navigation";

export default function Home() {
  redirect("/experiments/exp-1");
}
