import React, { useMemo } from "react";
import { editingCellContext } from "./EditorContext";
import { IColumnProps } from "./IColumnProps";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";
import { StaticCell } from "./StaticCell";
import { StickyCell } from "./StickyCell";

type IProps<TRow, TChange, TError> = {
  y: number;
  row: TRow;
  columnProps: IColumnProps<TRow, TChange, TError>[];
  errors: (TError | null)[];
  numStickyColumns: number;
  numHeaders: number;
  numUnselectableColumns: number;
};

export const Row = <TRow, TChange, TError>({
  y,
  row,
  columnProps,
  numStickyColumns,
  numHeaders,
  errors,
  numUnselectableColumns,
}: IProps<TRow, TChange, TError>) =>
  useMemo(
    () => (
      <MemoRow
        y={y}
        row={row}
        columnProps={columnProps}
        numStickyColumns={numStickyColumns}
        numHeaders={numHeaders}
        errors={errors}
        numUnselectableColumns={numUnselectableColumns}
      />
    ),
    [
      y,
      row,
      columnProps,
      numStickyColumns,
      numHeaders,
      errors,
      numUnselectableColumns,
    ]
  );

const MemoRow = <TRow, TChange, TError>({
  y,
  row,
  columnProps,
  errors,
  numStickyColumns,
  numHeaders,
  numUnselectableColumns,
}: IProps<TRow, TChange, TError>) => {
  const propsRef = usePropsRef<TRow, TChange, TError>();
  const setEditingCell = editingCellContext.useSetter();
  const setSelection = selectionContext.useSetter();

  if (!row) {
    return null;
  }

  return (
    <>
      {columnProps.map((props, x) => {
        const error = errors[x];
        const isReadonly = props.isReadonly?.(row) ?? false;
        const content = props.renderCell({
          row,
          onEdit: () => {
            setEditingCell({ x, y });
            setSelection({
              start: { x, y },
              height: 1,
              width: 1,
              primary: { x, y },
            });
          },
          errors,
          isReadonly,
          onChange: (row) => propsRef.current.onChange([row]),
        });
        return x < numStickyColumns ? (
          <StickyCell
            x={x}
            y={y}
            key={x}
            hasError={!!error}
            numHeaders={numHeaders}
            isSelectable={x >= numUnselectableColumns}
            borderRightColor={
              props.borderRightColor ?? columnProps[x + 1]?.borderLeftColor
            }
            isReadonly={isReadonly}
          >
            {content}
          </StickyCell>
        ) : (
          <StaticCell
            x={x}
            y={y}
            key={x}
            hasError={!!error}
            numHeaders={numHeaders}
            isSelectable={x >= numUnselectableColumns}
            borderRightColor={
              props.borderRightColor ?? columnProps[x + 1]?.borderLeftColor
            }
            isReadonly={isReadonly}
          >
            {content}
          </StaticCell>
        );
      })}
    </>
  );
};
