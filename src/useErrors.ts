import { useRef } from "react";
import { ISpreadsheetColumnProps } from "./useTableProps";

export const useErrors = <TElement, TRow, TError>(
  rows: { element: TElement; row: TRow }[],
  columnProps: ISpreadsheetColumnProps<TElement, TRow, TError>[]
) => {
  const errorsRef = useRef<(TError | null)[][] | null>(null);
  const prevRows = useRef<{ element: TElement; row: TRow }[] | null>(null);

  if (!errorsRef.current) {
    errorsRef.current = rows.map(({ element, row }) =>
      columnProps.map((props) => props.validate?.(element, row) ?? null)
    );
  } else if (prevRows.current) {
    const errors = errorsRef.current;
    errorsRef.current = rows.map((data, y) =>
      data === prevRows.current?.[y]
        ? errors[y]
        : columnProps.map(
            (props) => props.validate?.(data.element, data.row) ?? null
          )
    );
  }

  prevRows.current = rows;

  return errorsRef.current;
};
