import React from "react";

export type IColumnProps<TRow, TError> = {
  key: string;
  renderCell: (props: {
    row: TRow;
    errors: (TError | null)[];
    onChange: (row: TRow) => void;
    onEdit: () => void;
  }) => React.ReactNode;
  renderEditor: (props: {
    row: TRow;
    onChange: (row: TRow) => void;
    onBlur: () => void;
  }) => React.ReactNode;
  onCopy: (row: TRow) => string;
  onPaste: (row: TRow, value: string) => TRow;
  onClear: (row: TRow) => TRow;
  minWidth?: number;
  maxWidth?: number;
  borderLeftColor?: string;
  borderRightColor?: string;
};
