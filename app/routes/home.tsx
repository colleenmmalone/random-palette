import Palette from "~/pages/palette";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Random Palette Maker" },
    { name: "description", content: "Create a random color palette with two clicks!" },
  ];
}

export default function Home() {
  return <Palette />
}
