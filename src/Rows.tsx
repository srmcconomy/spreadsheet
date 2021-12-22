import { IColumnProps } from "./IColumnProps";
import { Row } from "./Row";
import { viewportStartContext, viewportSizeContext } from "./ViewportContext";
import React from "react";

export const Rows = <TRow, TChange, TError>({
  numStickyColumns,
  rows,
  columnProps,
  numHeaders,
  errors,
  numUnselectableColumns,
}: {
  numStickyColumns: number;
  rows: TRow[];
  columnProps: IColumnProps<TRow, TChange, TError>[];
  numHeaders: number;
  errors: (TError | null)[][];
  numUnselectableColumns: number;
}) => {
  const viewportStart = viewportStartContext.useState();
  const viewportSize = viewportSizeContext.useState();
  return (
    <>
      {[...new Array(viewportSize)].map((_, y) => {
        const actualY =
          Math.ceil((viewportStart - y) / viewportSize) * viewportSize + y - 1;
        return (
          <Row
            y={actualY}
            row={rows[actualY]}
            key={y}
            columnProps={columnProps}
            numStickyColumns={numStickyColumns}
            numHeaders={numHeaders}
            errors={errors[actualY]}
            numUnselectableColumns={numUnselectableColumns}
          />
        );
      })}
    </>
  );
};
