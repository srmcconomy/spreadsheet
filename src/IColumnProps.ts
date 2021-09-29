import React from "react";

export type IColumnProps<TRow, TError> = {
  key: string;
  renderHeader: () => React.ReactNode;
  toString: (row: TRow) => string;
  renderCell: (props: {
    row: TRow;
    onChange: (row: TRow) => void;
    onEdit: () => void;
  }) => React.ReactNode;
  renderEditor: (props: {
    row: TRow;
    onChange: (row: TRow) => void;
    onBlur: () => void;
  }) => React.ReactNode;
  validate: (row: TRow) => TError | null;
  onPaste: (row: TRow, value: string) => TRow;
  onClear: (row: TRow) => TRow;
  renderErrorTooltip: (error: TError) => React.ReactNode;
};
