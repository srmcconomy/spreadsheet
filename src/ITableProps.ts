import React from "react";
import { IColumnProps } from "./IColumnProps";
import { ITheme } from "./ITheme";

export type ITableProps<TRow, TChange, TError> = {
  rows: TRow[];
  errors: (TError | null)[][];
  columnProps: IColumnProps<TRow, TChange, TError>[];
  onChange: (changes: TChange[]) => void;
  onUndo: () => void;
  onRedo: () => void;
  rowHeight: number;
  numStickyColumns: number;
  numUnselectableColumns: number;
  headers: {
    height: number;
    borderTopColor?: string;
    borderBottomColor?: string;
    row: {
      key: string;
      component: React.ReactNode;
      columnSpan: number;
      borderLeftColor?: string;
      borderRightColor?: string;
    }[];
  }[];
  renderErrorTooltip: (error: TError) => React.ReactNode;
  theme?: ITheme;
};
