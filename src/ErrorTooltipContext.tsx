import { createStateContext } from "./StateContext";

export const errorTooltipContext = createStateContext<{
  el: HTMLElement;
  error: any;
  x: number;
} | null>(null);
