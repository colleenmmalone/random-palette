import { useState } from "react";
import type { ColorData } from "./types";

export function usePalette() {

  const [randomColor, setRandomColor] = useState("");
      const [colorFamily, setColorFamily] = useState('');
      const [data, setData] = useState<ColorData>();

  return{
    // State
    randomColor,
    colorFamily,
    data,

    // Setters
    setRandomColor,
    setColorFamily,
    setData,
  };
}
