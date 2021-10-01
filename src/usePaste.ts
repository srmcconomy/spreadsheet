import { useEffect } from "react";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";

export const usePaste = <TRow, TError>() => {
  const propsRef = usePropsRef<TRow, TError>();
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

      const changes: TRow[] = [];
      for (let y = 0; y < pastedRows.length * repeatY; y++) {
        let newRow = propsRef.current.rows[selectionRef.current.start.y + y];
        for (let x = 0; x < pastedRows[0].length * repeatX; x++) {
          newRow = propsRef.current.columnProps[
            selectionRef.current.start.x + x
          ].onPaste(
            newRow,
            pastedRows[y % pastedRows.length][x % pastedRows[0].length]
          );
        }
        changes.push(newRow);
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
