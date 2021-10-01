import React from "react";
import { IColumnProps } from "./IColumnProps";
import { ITheme } from "./ITheme";

export type ITableProps<TRow, TError> = {
  rows: TRow[];
  errors: (TError | null)[][];
  columnProps: IColumnProps<TRow, TError>[];
  onChange: (changes: TRow[]) => void;
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
