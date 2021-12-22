import { useEffect } from "react";
import { editingCellContext } from "./EditorContext";
import { selectionContext } from "./SelectionContext";
import { useSelectionUtils } from "./selectionUtils";

const keyMapping: { [key: string]: "left" | "right" | "up" | "down" } = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

const debounce = <TArgs extends any[]>(f: (...args: TArgs) => void) => {
  let lastArgs: TArgs;
  let calling = false;
  return (...args: TArgs) => {
    lastArgs = args;
    if (!calling) {
      calling = true;
      requestAnimationFrame(() => {
        calling = false;
        f(...lastArgs);
      });
    }
  };
};

export const useSelectionKeyHandlers = () => {
  const setSelection = selectionContext.useSetter();
  const setEditingCell = editingCellContext.useSetter();
  const { offsetSelection, offsetShiftSelection } = useSelectionUtils();

  useEffect(() => {
    const changeSelection = debounce(
      (shiftKey: boolean, mapping: "left" | "right" | "up" | "down") => {
        setEditingCell(null);
        if (shiftKey) {
          setSelection(
            (selection) => selection && offsetShiftSelection(selection, mapping)
          );
        } else {
          setSelection(
            (selection) => selection && offsetSelection(selection, mapping)
          );
        }
      }
    );

    window.addEventListener("keydown", (e) => {
      const mapping = keyMapping[e.key];
      if (!mapping) {
        return;
      }
      e.preventDefault();
      changeSelection(e.shiftKey, mapping);
    });
  }, []);
};
