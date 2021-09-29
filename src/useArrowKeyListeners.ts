import { useEffect } from "react";
import { useEditingCellRef } from "./EditorContext";
import { ISelection } from "./ISelection";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";

const offsetMapping = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const offsetSelection = (
  selection: ISelection,
  direction: "up" | "down" | "left" | "right",
  numRows: number,
  numColumns: number
) => {
  const mapping = offsetMapping[direction];
  const coordinates = {
    x: clamp(selection.primary.x + mapping.x, 0, numColumns - 1),
    y: clamp(selection.primary.y + mapping.y, 0, numRows - 1),
  };
  return {
    start: coordinates,
    primary: coordinates,
    height: 1,
    width: 1,
  };
};

const offsetShiftSelection = (
  selection: ISelection,
  direction: "up" | "down" | "left" | "right",
  numRows: number,
  numColumns: number
) => {
  switch (direction) {
    case "up":
      if (selection.start.y + selection.height - 1 > selection.primary.y) {
        return {
          ...selection,
          height: selection.height - 1,
        };
      }
      if (selection.start.y === 0) {
        return selection;
      }
      return {
        ...selection,
        start: {
          x: selection.start.x,
          y: selection.start.y - 1,
        },
        height: selection.height + 1,
      };
    case "down":
      if (selection.start.y < selection.primary.y) {
        return {
          ...selection,
          start: {
            x: selection.start.x,
            y: selection.start.y + 1,
          },
          height: selection.height - 1,
        };
      }
      if (selection.start.y + selection.height === numRows) {
        return selection;
      }
      return {
        ...selection,
        height: selection.height + 1,
      };
    case "left":
      if (selection.start.x + selection.width - 1 > selection.primary.x) {
        return {
          ...selection,
          width: selection.width - 1,
        };
      }
      if (selection.start.x === 0) {
        return selection;
      }
      return {
        ...selection,
        start: {
          x: selection.start.x - 1,
          y: selection.start.y,
        },
        width: selection.width + 1,
      };
    case "right":
      if (selection.start.x < selection.primary.x) {
        return {
          ...selection,
          start: {
            x: selection.start.x + 1,
            y: selection.start.y,
          },
          width: selection.width - 1,
        };
      }
      if (selection.start.x + selection.width === numColumns) {
        return selection;
      }
      return {
        ...selection,
        width: selection.width + 1,
      };
  }
};

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

const clamp = (n: number, min: number, max: number) =>
  Math.max(Math.min(n, max), min);

export const useArrowKeyListeners = <TRow, TError>() => {
  const selectionRef = selectionContext.useRef();
  const setSelection = selectionContext.useSetter();
  const { editingCellRef, setEditingCell } = useEditingCellRef();
  const propsRef = usePropsRef<TRow, TError>();

  const offsetShiftWithProps = (
    selection: ISelection,
    mapping: "left" | "right" | "up" | "down"
  ) =>
    offsetShiftSelection(
      selection,
      mapping,
      propsRef.current.undoStack.rows.length,
      propsRef.current.columnProps.length
    );

  const offsetWithProps = (
    selection: ISelection,
    mapping: "left" | "right" | "up" | "down"
  ) =>
    offsetSelection(
      selection,
      mapping,
      propsRef.current.undoStack.rows.length,
      propsRef.current.columnProps.length
    );

  useEffect(() => {
    const changeSelection = debounce(
      (shiftKey: boolean, mapping: "left" | "right" | "up" | "down") => {
        setEditingCell(null);
        if (shiftKey) {
          setSelection(
            (selection) => selection && offsetShiftWithProps(selection, mapping)
          );
        } else {
          setSelection(
            (selection) => selection && offsetWithProps(selection, mapping)
          );
        }
      }
    );

    window.addEventListener("keydown", (e) => {
      const mapping = keyMapping[e.key];
      if (!mapping) {
        if (e.key === "Enter") {
          if (editingCellRef.current) {
            setEditingCell(null);
            setSelection(
              (selection) => selection && offsetWithProps(selection, "down")
            );
          } else if (selectionRef.current) {
            setEditingCell(selectionRef.current.primary);
          }
        }
        if (e.key === "Tab") {
          if (editingCellRef.current) {
            setEditingCell(null);
            setSelection(
              (selection) => selection && offsetWithProps(selection, "right")
            );
          } else if (selectionRef.current) {
            setEditingCell(selectionRef.current.primary);
          }
          e.preventDefault();
        }
        if (e.key === "Delete" || e.key === "Backspace") {
          if (!editingCellRef.current && selectionRef.current) {
            propsRef.current.onChange([
              {
                row: propsRef.current.columnProps[
                  selectionRef.current.primary.x
                ].onClear(
                  propsRef.current.undoStack.rows[
                    selectionRef.current.primary.y
                  ]
                ),
                y: selectionRef.current.primary.y,
              },
            ]);
          }
        }
        if (e.key === " ") {
          if (!editingCellRef.current && selectionRef.current) {
            setEditingCell(selectionRef.current.primary);
          }
        }
        return;
      }
      e.preventDefault();
      changeSelection(e.shiftKey, mapping);
    });
  }, []);
};
