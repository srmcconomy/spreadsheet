import { IColumnProps } from "./IColumnProps";
import { Row } from "./Row";
import { viewportContext } from "./ViewportContext";

export const Rows = <TRow, TError>({
  numStickyColumns,
  rows,
  columnProps,
}: {
  numStickyColumns: number;
  rows: TRow[];
  columnProps: IColumnProps<TRow, TError>[];
}) => {
  const viewportStart = viewportContext.useState();
  return (
    <>
      {[...new Array(20)].map((_, y) => {
        const actualY = Math.ceil((viewportStart - y) / 20) * 20 + y - 1;
        return (
          <Row
            y={actualY}
            row={rows[actualY]}
            key={y}
            columnProps={columnProps}
            numStickyColumns={numStickyColumns}
          />
        );
      })}
    </>
  );
};
