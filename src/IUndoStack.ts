export type IUndoStack<TRow> = {
  stack: {
    undo: TRow[];
    redo: TRow[];
  }[];
  index: number;
};
