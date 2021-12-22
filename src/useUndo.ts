import { useEffect } from "react";
import { editingCellContext } from "./EditorContext";
import { usePropsRef } from "./PropsContext";

export const useUndo = <TRow, TChange, TError>() => {
  const propsRef = usePropsRef<TRow, TChange, TError>();
  const setEditingCell = editingCellContext.useSetter();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "z" && e.ctrlKey) {
        setEditingCell(null);
        if (e.shiftKey) {
          propsRef.current.onRedo();
        } else {
          propsRef.current.onUndo();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
};
