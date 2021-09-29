import styled from "styled-components";
import { selectionContext, isSelectingContext } from "./SelectionContext";
import { useArrowKeyListeners } from "./useArrowKeyListeners";
import { useCopy } from "./useCopy";
import { EditingCellProvider } from "./EditorContext";
import { usePaste } from "./usePaste";
import { ITableProps } from "./ITableProps";
import { PropsRefProvider } from "./PropsContext";
import { Headers } from "./Headers";
import { useUndo } from "./useUndo";
import { useEffect } from "react";
import { errorTooltipContext } from "./ErrorTooltipContext";
import { ErrorTooltip } from "./ErrorTooltip";
import { Selection } from "./Selection";
import { Editor } from "./EditorWrapper";
import { viewportContext } from "./ViewportContext";
import { Scroller } from "./Scroller";
import { Rows } from "./Rows";
import { stickyColumnContext } from "./StickyColumnContext";

export const Table = <TRow, TError>(props: ITableProps<TRow, TError>) => (
  <PropsRefProvider props={props}>
    <selectionContext.Provider>
      <isSelectingContext.Provider>
        <errorTooltipContext.Provider>
          <EditingCellProvider>
            <viewportContext.Provider>
              <stickyColumnContext.Provider>
                <TableContent {...props} />
              </stickyColumnContext.Provider>
            </viewportContext.Provider>
          </EditingCellProvider>
        </errorTooltipContext.Provider>
      </isSelectingContext.Provider>
    </selectionContext.Provider>
  </PropsRefProvider>
);

const TableContent = <TRow, TError>({
  undoStack,
  columnProps,
  rowHeight,
  numStickyColumns,
}: ITableProps<TRow, TError>) => {
  const setIsSelecting = isSelectingContext.useSetter();
  useArrowKeyListeners<TRow, TError>();
  useCopy<TRow, TError>();
  usePaste<TRow, TError>();
  useUndo<TRow, TError>();
  useEffect(() => {
    const listener = () => setIsSelecting(false);
    window.addEventListener("mouseup", listener);
    return () => window.removeEventListener("mouseup", listener);
  }, []);

  return (
    <Scroller>
      <TableContainer
        numColumns={columnProps.length}
        numRows={undoStack.rows.length}
        rowHeight={rowHeight}
      >
        <Selection numStickyColumns={numStickyColumns} />
        <Editor columnProps={columnProps} rows={undoStack.rows} />
        <Headers
          columnProps={columnProps}
          numStickyColumns={numStickyColumns}
        />
        <Rows
          rows={undoStack.rows}
          columnProps={columnProps}
          numStickyColumns={numStickyColumns}
        />
      </TableContainer>
      <ErrorTooltip columnProps={columnProps} />
    </Scroller>
  );
};

const TableContainer = styled.div<{
  numColumns: number;
  numRows: number;
  rowHeight: number;
}>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ numColumns }) => numColumns}, max-content);
  grid-template-rows: repeat(
    ${({ numRows }) => numRows + 1},
    ${({ rowHeight }) => `${rowHeight}px`}
  );
  user-select: none;
  width: max-content;
`;
