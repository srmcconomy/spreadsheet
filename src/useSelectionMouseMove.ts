import { useEffect, useRef } from "react";
import { useScrollerRef } from "./Scroller";
import { isSelectingContext, selectionContext } from "./SelectionContext";
import { useSelectionUtils } from "./selectionUtils";

export const useSelectionMouseMove = () => {
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isSelecting = isSelectingContext.useState();
  const scrollerRef = useScrollerRef();
  const setSelection = selectionContext.useSetter();
  const { offsetShiftSelection } = useSelectionUtils();

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousemove", listener);
    return () => document.removeEventListener("mousemove", listener);
  }, []);

  useEffect(() => {
    if (isSelecting) {
      const timeout = setInterval(() => {
        if (!scrollerRef.current) {
          return;
        }
        const boundingBox = scrollerRef.current.getBoundingClientRect();
        if (lastMousePosRef.current.x > boundingBox.right) {
          setSelection((s) => s && offsetShiftSelection(s, "right"));
        }
        if (lastMousePosRef.current.x < boundingBox.left) {
          setSelection((s) => s && offsetShiftSelection(s, "left"));
        }
        if (lastMousePosRef.current.y > boundingBox.bottom) {
          setSelection((s) => s && offsetShiftSelection(s, "down"));
        }
        if (lastMousePosRef.current.y < boundingBox.top) {
          setSelection((s) => s && offsetShiftSelection(s, "up"));
        }
      }, 100);
      return () => clearInterval(timeout);
    }
    return;
  }, [isSelecting]);
};
