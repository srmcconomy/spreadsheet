import { useEffect } from "react";
import { editingCellContext } from "./EditorContext";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";
import { useSelectionUtils } from "./selectionUtils";

const functionKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Control",
  "Shift",
  "Enter",
  " ",
  "Tab",
  "Backspace",
  "Delete",
];

export const useEditorKeyHandlers = <TRow, TChange, TError>() => {
  const editingCellRef = editingCellContext.useRef();
  const setEditingCell = editingCellContext.useSetter();
  const selectionRef = selectionContext.useRef();
  const setSelection = selectionContext.useSetter();
  const propsRef = usePropsRef<TRow, TChange, TError>();

  const { offsetSelection } = useSelectionUtils();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      if (e.key === "Enter") {
        if (editingCellRef.current) {
          setEditingCell(null);
          setSelection(
            (selection) => selection && offsetSelection(selection, "down")
          );
          e.preventDefault();
        } else if (selectionRef.current) {
          const isReadonly =
            propsRef.current.columnProps[
              selectionRef.current.primary.x
            ].isReadonly?.(
              propsRef.current.rows[selectionRef.current.primary.y]
            ) ?? false;
          if (!isReadonly) {
            setEditingCell(selectionRef.current.primary);
          }
          e.preventDefault();
        }
      }
      if (e.key === "Tab") {
        setEditingCell(null);
        setSelection(
          (selection) => selection && offsetSelection(selection, "right")
        );
        e.preventDefault();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (!editingCellRef.current && selectionRef.current) {
          const isReadonly =
            propsRef.current.columnProps[
              selectionRef.current.primary.x
            ].isReadonly?.(
              propsRef.current.rows[selectionRef.current.primary.y]
            ) ?? false;

          if (!isReadonly) {
            propsRef.current.onChange([
              propsRef.current.columnProps[
                selectionRef.current.primary.x
              ].onClear(propsRef.current.rows[selectionRef.current.primary.y]),
            ]);
          }
          e.preventDefault();
        }
      }
      if (e.key === " ") {
        if (!editingCellRef.current && selectionRef.current) {
          const isReadonly =
            propsRef.current.columnProps[
              selectionRef.current.primary.x
            ].isReadonly?.(
              propsRef.current.rows[selectionRef.current.primary.y]
            ) ?? false;
          if (!isReadonly) {
            setEditingCell(selectionRef.current.primary);
          }
          e.preventDefault();
        }
      }
      if (
        selectionRef.current &&
        !editingCellRef.current &&
        !functionKeys.includes(e.key) &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        const isReadonly =
          propsRef.current.columnProps[
            selectionRef.current.primary.x
          ].isReadonly?.(
            propsRef.current.rows[selectionRef.current.primary.y]
          ) ?? false;
        if (!isReadonly) {
          propsRef.current.onChange([
            propsRef.current.columnProps[
              selectionRef.current.primary.x
            ].onClear(propsRef.current.rows[selectionRef.current.primary.y]),
          ]);
          setEditingCell(selectionRef.current.primary);
        }
      }
    };

    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
};
