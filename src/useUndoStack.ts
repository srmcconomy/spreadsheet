import { useRef, useCallback, useMemo } from "react";
import * as UndoStack from "./UndoStack";

export const useUndoStack = <TElement, TKey>(
  elements: TElement[],
  getKey: (row: TElement) => TKey,
  onChange: (elements: TElement[]) => void
) => {
  const undoStackRef = useRef(UndoStack.create<TElement>());

  const elementsRef = useRef<TElement[]>(elements);
  elementsRef.current = elements;
  const indexByKey = useMemo<Map<TKey, number>>(
    () => new Map(elements.map((element, index) => [getKey(element), index])),
    [elements, getKey]
  );

  return {
    handleUndo: useCallback(() => {
      const [newStack, changes] = UndoStack.undo(undoStackRef.current);
      const newElements = [...elements];
      changes.forEach((change) => {
        const index = indexByKey.get(getKey(change));
        if (index === undefined) {
          return;
        }
        newElements[index] = change;
      });
      undoStackRef.current = newStack;
      onChange(newElements);
    }, [indexByKey, getKey]),

    handleRedo: useCallback(() => {
      const [newStack, changes] = UndoStack.redo(undoStackRef.current);
      const newElements = [...elements];
      changes.forEach((change) => {
        const index = indexByKey.get(getKey(change));
        if (index === undefined) {
          return;
        }
        newElements[index] = change;
      });
      undoStackRef.current = newStack;
      onChange(newElements);
    }, [indexByKey, getKey]),

    handleChange: useCallback(
      (changes: TElement[]) => {
        const newStack = UndoStack.push(
          undoStackRef.current,
          changes,
          elementsRef.current,
          (element) => indexByKey.get(getKey(element))!
        );
        const newElements = [...elements];
        changes.forEach((change) => {
          const index = indexByKey.get(getKey(change));
          if (index === undefined) {
            return;
          }
          newElements[index] = change;
        });
        undoStackRef.current = newStack;
        onChange(newElements);
      },
      [onChange, indexByKey, getKey]
    ),
  };
};
