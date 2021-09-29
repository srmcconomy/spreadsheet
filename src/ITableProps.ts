import { IColumnProps } from "./IColumnProps";
import { IUndoStack } from "./IUndoStack";

export type ITableProps<TRow, TError> = {
  undoStack: IUndoStack<TRow>;
  columnProps: IColumnProps<TRow, TError>[];
  getKey: (row: TRow) => string;
  onChange: (changes: { row: TRow; y: number }[]) => void;
  onUndo: () => void;
  onRedo: () => void;
  rowHeight: number;
  numStickyColumns: number;
};
