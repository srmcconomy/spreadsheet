import { createStateContext } from "./StateContext";

export const hoveredCellContext = createStateContext<{
  el: HTMLElement;
  x: number;
  y: number;
} | null>(null);
