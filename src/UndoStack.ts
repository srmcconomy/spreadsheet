import { IUndoStack } from "./IUndoStack";

export const create = <TRow>(rows: TRow[]): IUndoStack<TRow> => ({
  stack: [],
  rows,
  index: -1,
});

export const undo = <TRow>(undoStack: IUndoStack<TRow>): IUndoStack<TRow> => {
  if (undoStack.index < 0) {
    return undoStack;
  }
  const rows = [...undoStack.rows];
  undoStack.stack[undoStack.index].undo.forEach(({ row, y }) => {
    rows[y] = row;
  });
  return {
    stack: undoStack.stack,
    rows,
    index: undoStack.index - 1,
  };
};

export const redo = <TRow>(undoStack: IUndoStack<TRow>): IUndoStack<TRow> => {
  if (undoStack.index === undoStack.stack.length - 1) {
    return undoStack;
  }
  const rows = [...undoStack.rows];
  undoStack.stack[undoStack.index + 1].redo.forEach(({ row, y }) => {
    rows[y] = row;
  });
  return {
    stack: undoStack.stack,
    rows,
    index: undoStack.index + 1,
  };
};

export const push = <TRow>(
  undoStack: IUndoStack<TRow>,
  changes: { row: TRow; y: number }[]
): IUndoStack<TRow> => {
  const rows = [...undoStack.rows];
  changes.forEach(({ y, row }) => {
    rows[y] = row;
  });
  return {
    stack: [
      ...undoStack.stack.slice(0, undoStack.index + 1),
      {
        redo: changes,
        undo: changes.map(({ y }) => ({ y, row: undoStack.rows[y] })),
      },
    ],
    index: undoStack.index + 1,
    rows,
  };
};

export const merge = <TRow>(
  undoStack: IUndoStack<TRow>,
  changes: { row: TRow; y: number }[]
): IUndoStack<TRow> => {
  const rows = [...undoStack.rows];
  changes.forEach(({ y, row }) => {
    rows[y] = row;
  });
  return {
    stack: [
      ...undoStack.stack.slice(0, undoStack.index - 1),
      {
        redo: [...undoStack.stack[undoStack.index].redo, ...changes],
        undo: [
          ...changes.map(({ y }) => ({ y, row: undoStack.rows[y] })),
          ...undoStack.stack[undoStack.index].undo,
        ],
      },
    ],
    rows,
    index: undoStack.index,
  };
};
