import { useEffect } from "react";
import { useEditingCellRef } from "./EditorContext";
import { usePropsRef } from "./PropsContext";

export const useUndo = <TRow, TError>() => {
  const propsRef = usePropsRef<TRow, TError>();
  const { setEditingCell } = useEditingCellRef();

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
