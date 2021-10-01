import styled, { ThemeProvider } from "styled-components";
import { selectionContext, isSelectingContext } from "./SelectionContext";
import { useCopy } from "./useCopy";
import { editingCellContext } from "./EditorContext";
import { usePaste } from "./usePaste";
import { ITableProps } from "./ITableProps";
import { PropsRefProvider } from "./PropsContext";
import { Headers } from "./Headers";
import { useUndo } from "./useUndo";
import React from "react";
import { hoveredCellContext } from "./hoveredCellContext";
import { ErrorTooltip } from "./ErrorTooltip";
import { Selection } from "./Selection";
import { Editor } from "./Editor";
import { viewportSizeContext, viewportStartContext } from "./ViewportContext";
import { Scroller } from "./Scroller";
import { Rows } from "./Rows";
import { stickyColumnContext } from "./StickyColumnContext";
import { defaultTheme } from "./defaultTheme";

export const Table = <TRow, TError>(props: ITableProps<TRow, TError>) => (
  <ThemeProvider theme={props.theme ?? defaultTheme}>
    <PropsRefProvider props={props}>
      <selectionContext.Provider>
        <isSelectingContext.Provider>
          <hoveredCellContext.Provider>
            <editingCellContext.Provider>
              <viewportSizeContext.Provider>
                <viewportStartContext.Provider>
                  <stickyColumnContext.Provider>
                    <TableContent {...props} />
                  </stickyColumnContext.Provider>
                </viewportStartContext.Provider>
              </viewportSizeContext.Provider>
            </editingCellContext.Provider>
          </hoveredCellContext.Provider>
        </isSelectingContext.Provider>
      </selectionContext.Provider>
    </PropsRefProvider>
  </ThemeProvider>
);

const TableContent = <TRow, TError>({
  rows,
  columnProps,
  rowHeight,
  numStickyColumns,
  numUnselectableColumns,
  headers,
  errors,
  renderErrorTooltip,
}: ITableProps<TRow, TError>) => {
  useCopy<TRow, TError>();
  usePaste<TRow, TError>();
  useUndo<TRow, TError>();

  return (
    <Scroller>
      <TableContainer
        columnData={columnProps}
        numRows={rows.length}
        rowHeight={rowHeight}
        headers={headers}
      >
        <Selection
          numStickyColumns={numStickyColumns}
          headers={headers}
          rowHeight={rowHeight}
        />
        <Editor
          columnProps={columnProps}
          rows={rows}
          numHeaders={headers.length}
        />
        <Headers headers={headers} numStickyColumns={numStickyColumns} />
        <Rows
          rows={rows}
          columnProps={columnProps}
          numStickyColumns={numStickyColumns}
          numHeaders={headers.length}
          errors={errors}
          numUnselectableColumns={numUnselectableColumns}
        />
      </TableContainer>
      <ErrorTooltip renderErrorTooltip={renderErrorTooltip} errors={errors} />
    </Scroller>
  );
};

const TableContainer = styled.div<{
  columnData: { minWidth?: number; maxWidth?: number }[];
  numRows: number;
  rowHeight: number;
  headers: { height: number }[];
}>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ columnData }) =>
    columnData
      .map(
        ({ minWidth, maxWidth }) =>
          `minmax(${minWidth ? `${minWidth}px` : "max-content"}, ${
            maxWidth ? `${maxWidth}px` : "1fr"
          })`
      )
      .join(" ")};
  grid-template-rows: ${({ headers }) =>
      headers.map(({ height }) => `${height}px`).join(" ")} repeat(
      ${({ numRows }) => numRows},
      ${({ rowHeight }) => `${rowHeight}px`}
    );
  user-select: none;
`;
