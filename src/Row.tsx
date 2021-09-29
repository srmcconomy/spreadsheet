import { useMemo } from "react";
import { useEditingCellRef } from "./EditorContext";
import { IColumnProps } from "./IColumnProps";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";
import { StaticCell } from "./StaticCell";
import { StickyCell } from "./StickyCell";

type IProps<TRow, TError> = {
  y: number;
  row: TRow;
  columnProps: IColumnProps<TRow, TError>[];
  numStickyColumns: number;
};

export const Row = <TRow, TError>({
  y,
  row,
  columnProps,
  numStickyColumns,
}: IProps<TRow, TError>) =>
  useMemo(
    () => (
      <MemoRow
        y={y}
        row={row}
        columnProps={columnProps}
        numStickyColumns={numStickyColumns}
      />
    ),
    [y, row, columnProps, numStickyColumns]
  );

const MemoRow = <TRow, TError>({
  y,
  row,
  columnProps,
  numStickyColumns,
}: IProps<TRow, TError>) => {
  const propsRef = usePropsRef();
  const { setEditingCell } = useEditingCellRef();
  const setSelection = selectionContext.useSetter();

  if (!row) {
    return null;
  }

  return (
    <>
      {columnProps.map((props, x) => {
        const error = props.validate(row);
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
          onChange: (row) => propsRef.current.onChange([{ y, row }]),
        });
        return x < numStickyColumns ? (
          <StickyCell x={x} y={y} key={x} error={error}>
            {content}
          </StickyCell>
        ) : (
          <StaticCell x={x} y={y} key={x} error={error}>
            {content}
          </StaticCell>
        );
      })}
    </>
  );
};
