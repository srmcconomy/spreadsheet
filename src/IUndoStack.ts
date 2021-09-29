export type IUndoStack<TRow> = {
  stack: {
    undo: { row: TRow; y: number }[];
    redo: { row: TRow; y: number }[];
  }[];
  rows: TRow[];
  index: number;
};
