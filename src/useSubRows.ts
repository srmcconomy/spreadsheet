import { useRef } from "react";
import { ISpreadsheetColumnProps } from "./useTableProps";

export const useSubRows = <TElement, TRow, TKey, TError>(
  elements: TElement[],
  createRows: (element: TElement) => TRow[],
  getKey: (row: TElement) => TKey,
  areElementsEqual: (a: TElement, b: TElement) => boolean,
  columnProps: ISpreadsheetColumnProps<TElement, TRow, TError>[]
) => {
  const prevElements = useRef<TElement[] | null>(null);
  const prevGetKeyRef = useRef<((element: TElement) => TKey) | null>(null);
  const indexByKey = useRef<Map<
    TKey,
    { rowsStart: number; numRows: number }
  > | null>(null);

  const rowsRef = useRef<{ element: TElement; row: TRow }[] | null>(null);
  const errorGroupsRef = useRef<(TError | null)[][][] | null>(null);
  const errorsRef = useRef<(TError | null)[][] | null>(null);

  let needFullReindex = true;
  if (
    indexByKey.current &&
    rowsRef.current &&
    prevGetKeyRef.current === getKey &&
    errorsRef.current &&
    errorGroupsRef.current
  ) {
    if (prevElements.current !== elements) {
      if (prevElements.current?.length === elements.length) {
        needFullReindex = false;
        const changedIndices = prevElements.current
          .map((_, i) => i)
          .filter(
            (i) => !areElementsEqual(prevElements.current![i], elements[i])
          );
        const newRows = [...rowsRef.current];
        const newErrors = [...errorsRef.current];
        const newErrorGroups = [...errorGroupsRef.current];
        for (const i of changedIndices) {
          const newKey = getKey(elements[i]);
          if (newKey !== getKey(prevElements.current[i])) {
            needFullReindex = true;
            break;
          }
          const data = indexByKey.current?.get(newKey);
          if (!data) {
            needFullReindex = true;
            break;
          }
          const updatedRows = createRows(elements[i]);
          if (updatedRows.length !== data.numRows) {
            needFullReindex = true;
            break;
          }
          updatedRows.forEach((row, rowIndex) => {
            newRows[data.rowsStart + rowIndex] = { element: elements[i], row };
            const errors = columnProps.map(
              (props) => props.validate?.(elements[i], row) ?? null
            );
            newErrors[data.rowsStart + rowIndex] = errors;
            newErrorGroups[i][rowIndex] = errors;
          });
        }
        rowsRef.current = newRows;
        errorsRef.current = newErrors;
        errorGroupsRef.current = newErrorGroups;
      }
    }
  }

  if (needFullReindex) {
    const rowGroups = elements.map(createRows);
    let rowIndex = 0;
    indexByKey.current = new Map(
      rowGroups.map((rowGroup, index) => {
        const ret = [
          getKey(elements[index]),
          {
            elementIndex: index,
            rowsStart: rowIndex,
            numRows: rowGroup.length,
          },
        ] as const;
        rowIndex += rowGroup.length;
        return ret;
      })
    );
    rowsRef.current = rowGroups.flatMap((rows, index) =>
      rows.map((row) => ({
        row,
        element: elements[index],
      }))
    );

    errorGroupsRef.current = rowGroups.map((rowGroup, index) =>
      rowGroup.map((row) =>
        columnProps.map(
          (props) => props.validate?.(elements[index], row) ?? null
        )
      )
    );
    errorsRef.current = errorGroupsRef.current.flat();
  }

  prevGetKeyRef.current = getKey;
  prevElements.current = elements;

  return {
    rows: rowsRef.current!,
    errors: errorsRef.current!,
    errorGroups: errorGroupsRef.current!,
  };
};
