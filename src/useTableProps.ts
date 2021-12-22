import React, { useMemo } from "react";
import { IColumnProps } from "./IColumnProps";
import { ITableProps } from "./ITableProps";
import { useSubRows } from "./useSubRows";
import { useUndoStack } from "./useUndoStack";

type ISpreadsheetData<TElement, TRow, TError> = {
  props: ITableProps<{ element: TElement; row: TRow }, TElement, TError>;
  errorGroups: (TError | null)[][][];
  handleUndo: () => void;
  handleRedo: () => void;
};

export type ISpreadsheetColumnProps<TElement, TRow, TError> = {
  validate?: (element: TElement, row: TRow) => TError | null;
  renderCell: (
    props: {
      element: TElement;
      row: TRow;
    } & Omit<
      Parameters<
        IColumnProps<
          { element: TElement; row: TRow },
          TElement,
          TError
        >["renderCell"]
      >[0],
      "row"
    >
  ) => React.ReactNode;
  renderEditor: (
    props: {
      element: TElement;
      row: TRow;
    } & Omit<
      Parameters<
        IColumnProps<
          { element: TElement; row: TRow },
          TElement,
          TError
        >["renderEditor"]
      >[0],
      "row"
    >
  ) => React.ReactNode;
  onCopy: (element: TElement, row: TRow) => string;
  onPaste: (element: TElement, row: TRow, value: string) => TElement;
  onClear: (element: TElement, row: TRow) => TElement;
  isReadonly?: (element: TElement, row: TRow) => boolean;
} & Omit<
  IColumnProps<{ element: TElement; row: TRow }, TElement, TError>,
  | "renderCell"
  | "renderEditor"
  | "onCopy"
  | "onPaste"
  | "onClear"
  | "isReadonly"
>;

type ISpreadsheetProps<TElement, TRow, TKey, TError> = {
  elements: TElement[];
  createRows: (element: TElement) => TRow[];
  areRowsEqual: (a: TElement, b: TElement) => boolean;
  columnProps: ISpreadsheetColumnProps<TElement, TRow, TError>[];
  getKey: (element: TElement) => TKey;
  onChange: (elements: TElement[]) => void;
} & Omit<
  ITableProps<{ element: TElement; row: TRow }, TElement, TError>,
  | "rows"
  | "undoStack"
  | "errors"
  | "onChange"
  | "onUndo"
  | "onRedo"
  | "columnProps"
>;

export const useSpreadsheet = <TElement, TRow, TKey, TError>({
  elements,
  createRows,
  areRowsEqual,
  columnProps,
  getKey,
  onChange,
  ...props
}: ISpreadsheetProps<TElement, TRow, TKey, TError>): ISpreadsheetData<
  TElement,
  TRow,
  TError
> => {
  const { rows, errors, errorGroups } = useSubRows(
    elements,
    createRows,
    getKey,
    areRowsEqual,
    columnProps
  );
  const { handleUndo, handleRedo, handleChange } = useUndoStack(
    elements,
    getKey,
    onChange
  );

  const convertedColumnProps = useMemo<
    IColumnProps<{ element: TElement; row: TRow }, TElement, TError>[]
  >(
    () =>
      columnProps.map(
        ({
          renderCell,
          renderEditor,
          onCopy,
          onPaste,
          onClear,
          isReadonly,
          ...otherProps
        }) => ({
          renderCell: ({ row: { row, element }, ...renderProps }) =>
            renderCell({
              element,
              row,
              ...renderProps,
            }),
          renderEditor: ({ row: { row, element }, ...renderProps }) =>
            renderEditor({
              element,
              row,
              ...renderProps,
            }),
          onCopy: ({ row, element }) => onCopy(element, row),
          onPaste: ({ element, row }, prevChange, value) =>
            onPaste(prevChange ?? element, row, value),
          onClear: ({ element, row }) => onClear(element, row),
          isReadonly: isReadonly
            ? ({ element, row }) => isReadonly(element, row)
            : undefined,
          ...otherProps,
        })
      ),
    [columnProps]
  );

  return {
    props: {
      rows,
      columnProps: convertedColumnProps,
      errors,
      onChange: handleChange,
      onUndo: handleUndo,
      onRedo: handleRedo,
      ...props,
    },
    handleUndo,
    handleRedo,
    errorGroups,
  };
};
