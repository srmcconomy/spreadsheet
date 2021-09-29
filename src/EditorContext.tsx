import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import { ICoordinates } from "./ICoordinates";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";

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

const editingCellContext = React.createContext<ICoordinates | null>(null);
const editingCellRefContext = React.createContext<{
  editingCellRef: React.MutableRefObject<ICoordinates | null>;
  setEditingCell: React.Dispatch<React.SetStateAction<ICoordinates | null>>;
}>({
  editingCellRef: { current: null },
  setEditingCell: () => {},
});

export const useEditingCell = () => useContext(editingCellContext);
export const useEditingCellRef = () => useContext(editingCellRefContext);

export const EditingCellProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [editingCell, setEditingCell] = useState<ICoordinates | null>(null);
  const selectionRef = selectionContext.useRef();
  const editingCellRef = useRef<ICoordinates | null>(null);
  const propsRef = usePropsRef();

  useEffect(() => {
    editingCellRef.current = editingCell;
  }, [editingCell]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (
        editingCellRef.current ||
        functionKeys.includes(e.key) ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }
      if (selectionRef.current) {
        propsRef.current.onChange([
          {
            row: propsRef.current.columnProps[
              selectionRef.current.primary.x
            ].onClear(
              propsRef.current.undoStack.rows[selectionRef.current.primary.y]
            ),
            y: selectionRef.current.primary.y,
          },
        ]);
        setEditingCell(selectionRef.current.primary);
      }
    });
  }, []);

  const memoizedEditingCell = useMemo(
    () => editingCell,
    [editingCell?.x, editingCell?.y]
  );

  const memoizedRefObject = useMemo(
    () => ({ editingCellRef, setEditingCell }),
    []
  );

  return (
    <editingCellContext.Provider value={memoizedEditingCell}>
      <editingCellRefContext.Provider value={memoizedRefObject}>
        {children}
      </editingCellRefContext.Provider>
    </editingCellContext.Provider>
  );
};
