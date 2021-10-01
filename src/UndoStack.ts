import { IUndoStack } from "./IUndoStack";

export const create = <TRow>(): IUndoStack<TRow> => ({
  stack: [],
  index: -1,
});

export const undo = <TRow, TKey>(
  undoStack: IUndoStack<TRow>,
  rows: TRow[],
  indexByKey: Map<TKey, number>,
  getKey: (row: TRow) => TKey
): [IUndoStack<TRow>, TRow[]] => {
  if (undoStack.index < 0) {
    return [undoStack, rows];
  }
  const newRows = [...rows];
  undoStack.stack[undoStack.index].undo.forEach((row) => {
    const index = indexByKey.get(getKey(row));
    if (index !== undefined) {
      newRows[index] = row;
    }
  });
  return [{ stack: undoStack.stack, index: undoStack.index - 1 }, newRows];
};

export const redo = <TRow, TKey>(
  undoStack: IUndoStack<TRow>,
  rows: TRow[],
  indexByKey: Map<TKey, number>,
  getKey: (row: TRow) => TKey
): [IUndoStack<TRow>, TRow[]] => {
  if (undoStack.index === undoStack.stack.length - 1) {
    return [undoStack, rows];
  }
  const newRows = [...rows];
  undoStack.stack[undoStack.index + 1].redo.forEach((row) => {
    const index = indexByKey.get(getKey(row));
    if (index !== undefined) {
      newRows[index] = row;
    }
  });
  return [{ stack: undoStack.stack, index: undoStack.index + 1 }, newRows];
};

export const push = <TRow, TKey>(
  undoStack: IUndoStack<TRow>,
  rows: TRow[],
  changes: TRow[],
  indexByKey: Map<TKey, number>,
  getKey: (row: TRow) => TKey
): [IUndoStack<TRow>, TRow[]] => {
  const newRows = [...rows];
  const undoChanges: TRow[] = [];
  changes.forEach((row) => {
    const index = indexByKey.get(getKey(row));
    if (index !== undefined) {
      undoChanges.push(rows[index]);
      newRows[index] = row;
    }
  });
  return [
    {
      stack: [
        ...undoStack.stack.slice(0, undoStack.index + 1),
        {
          redo: changes,
          undo: undoChanges,
        },
      ],
      index: undoStack.index + 1,
    },
    newRows,
  ];
};

export const merge = <TRow, TKey>(
  undoStack: IUndoStack<TRow>,
  rows: TRow[],
  changes: TRow[],
  indexByKey: Map<TKey, number>,
  getKey: (row: TRow) => TKey
): [IUndoStack<TRow>, TRow[]] => {
  const newRows = [...rows];
  const undoChanges: TRow[] = [];
  changes.forEach((row) => {
    const index = indexByKey.get(getKey(row));
    if (index !== undefined) {
      undoChanges.push(rows[index]);
      newRows[index] = row;
    }
  });
  return [
    {
      stack: [
        ...undoStack.stack.slice(0, undoStack.index - 1),
        {
          redo: [...undoStack.stack[undoStack.index].redo, ...changes],
          undo: [...undoChanges, ...undoStack.stack[undoStack.index].undo],
        },
      ],
      index: undoStack.index,
    },
    newRows,
  ];
};
