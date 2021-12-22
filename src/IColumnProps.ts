import React from "react";

export type IColumnProps<TRow, TChange, TError> = {
  key: string;
  renderCell: (props: {
    row: TRow;
    errors: (TError | null)[];
    isReadonly: boolean;
    onChange: (change: TChange) => void;
    onEdit: () => void;
  }) => React.ReactNode;
  renderEditor: (props: {
    row: TRow;
    onChange: (change: TChange) => void;
    onBlur: () => void;
  }) => React.ReactNode;
  onCopy: (row: TRow) => string;
  onPaste: (row: TRow, prevChange: TChange | null, value: string) => TChange;
  onClear: (row: TRow) => TChange;
  minWidth?: number;
  maxWidth?: number;
  borderLeftColor?: string;
  borderRightColor?: string;
  isReadonly?: (row: TRow) => boolean;
};
