import { useEffect } from "react";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";

export const usePaste = <TRow, TChange, TError>() => {
  const propsRef = usePropsRef<TRow, TChange, TError>();
  const selectionRef = selectionContext.useRef();
  const setSelection = selectionContext.useSetter();

  useEffect(() => {
    const listener = (e: ClipboardEvent) => {
      if (!selectionRef.current) {
        return;
      }
      const data = e.clipboardData?.getData("text");
      if (!data) {
        return;
      }

      const pastedRows = data.split("\n").map((row) => row.split("\t"));

      if (pastedRows.length === 0) {
        return;
      }

      const repeatX =
        Math.floor(selectionRef.current.width / pastedRows[0].length) || 1;
      const repeatY =
        Math.floor(selectionRef.current.height / pastedRows.length) || 1;

      const changes: TChange[] = [];
      for (let y = 0; y < pastedRows.length * repeatY; y++) {
        const row = propsRef.current.rows[selectionRef.current.start.y + y];
        let combinedChange = null;
        for (let x = 0; x < pastedRows[0].length * repeatX; x++) {
          const isReadonly =
            propsRef.current.columnProps[
              selectionRef.current.start.x + x
            ].isReadonly?.(row) ?? false;
          if (!isReadonly) {
            combinedChange = propsRef.current.columnProps[
              selectionRef.current.start.x + x
            ].onPaste(
              row,
              combinedChange,
              pastedRows[y % pastedRows.length][x % pastedRows[0].length]
            );
          }
        }
        if (combinedChange) {
          changes.push(combinedChange);
        }
      }
      propsRef.current.onChange(changes);

      setSelection({
        start: selectionRef.current.start,
        primary: {
          x: Math.min(
            selectionRef.current.primary.x,
            selectionRef.current.start.x + pastedRows[0].length * repeatX
          ),
          y: Math.min(
            selectionRef.current.primary.y,
            selectionRef.current.start.y + pastedRows.length * repeatY
          ),
        },
        width: pastedRows[0].length * repeatX,
        height: pastedRows.length * repeatY,
      });
    };
    document.addEventListener("paste", listener);
    return () => document.removeEventListener("paste", listener);
  }, []);
};
