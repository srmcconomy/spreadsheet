import { IUndoStack } from "./IUndoStack";

export const create = <TElement>(): IUndoStack<TElement> => ({
  stack: [],
  index: -1,
});

export const undo = <TElement>(
  undoStack: IUndoStack<TElement>
): [IUndoStack<TElement>, TElement[]] => {
  if (undoStack.index < 0) {
    return [undoStack, []];
  }
  return [
    { stack: undoStack.stack, index: undoStack.index - 1 },
    undoStack.stack[undoStack.index].undo,
  ];
};

export const redo = <TElement>(
  undoStack: IUndoStack<TElement>
): [IUndoStack<TElement>, TElement[]] => {
  if (undoStack.index === undoStack.stack.length - 1) {
    return [undoStack, []];
  }
  return [
    { stack: undoStack.stack, index: undoStack.index + 1 },
    undoStack.stack[undoStack.index + 1].redo,
  ];
};

export const push = <TElement>(
  undoStack: IUndoStack<TElement>,
  changes: TElement[],
  elements: TElement[],
  getIndex: (element: TElement) => number
): IUndoStack<TElement> => {
  const undoChanges = changes.map((element) => {
    const index = getIndex(element);
    return elements[index];
  });

  return {
    stack: [
      ...undoStack.stack.slice(0, undoStack.index + 1),
      {
        redo: changes,
        undo: undoChanges,
      },
    ],
    index: undoStack.index + 1,
  };
};

export const merge = <TElement>(
  undoStack: IUndoStack<TElement>,
  changes: TElement[],
  elements: TElement[],
  getIndex: (element: TElement) => number
): IUndoStack<TElement> => {
  const undoChanges = changes.map((element) => {
    const index = getIndex(element);
    return elements[index];
  });
  return {
    stack: [
      ...undoStack.stack.slice(0, undoStack.index - 1),
      {
        redo: [...undoStack.stack[undoStack.index].redo, ...changes],
        undo: [...undoChanges, ...undoStack.stack[undoStack.index].undo],
      },
    ],
    index: undoStack.index,
  };
};
