import { isSelectingContext, selectionContext } from "./SelectionContext";
import styled from "styled-components";
import { useEditingCellRef } from "./EditorContext";
import React, { useRef } from "react";
import { errorTooltipContext } from "./ErrorTooltipContext";

type IProps<TError> = {
  x: number;
  y: number;
  style: React.CSSProperties;
  error: TError | null;
  children: React.ReactNode;
};

export const CellWrapper = React.forwardRef(
  <TError extends unknown>(
    { x, y, style, error, children }: IProps<TError>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const setSelection = selectionContext.useSetter();
    const setIsSelecting = isSelectingContext.useSetter();
    const isSelectingRef = isSelectingContext.useRef();
    const { editingCellRef, setEditingCell } = useEditingCellRef();
    const cellRef = useRef<HTMLDivElement | null>(null);
    const setErrorTooltip = errorTooltipContext.useSetter();

    return (
      <CellContainer
        ref={(el) => {
          cellRef.current = el;
          if (ref) {
            if (typeof ref === "function") {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        onMouseDown={(e) => {
          if (e.button !== 0) {
            return;
          }
          if (
            editingCellRef.current?.x === x &&
            editingCellRef.current?.y === y
          ) {
            return;
          }
          setEditingCell(null);
          setSelection({
            primary: { x, y },
            start: { x, y },
            height: 1,
            width: 1,
          });
          setIsSelecting(true);
        }}
        onDoubleClick={() => {
          setEditingCell({ x, y });
        }}
        onMouseEnter={() => {
          if (cellRef.current && error) {
            setErrorTooltip({ el: cellRef.current, error, x });
          } else {
            setErrorTooltip(null);
          }
          if (isSelectingRef.current) {
            setSelection(
              (selection) =>
                selection && {
                  primary: selection.primary,
                  start: {
                    x: Math.min(x, selection.primary.x),
                    y: Math.min(y, selection.primary.y),
                  },
                  height: Math.abs(y - selection.primary.y) + 1,
                  width: Math.abs(x - selection.primary.x) + 1,
                }
            );
          }
        }}
        style={style}
      >
        {error ? (
          <>
            <InvalidIndicator />
          </>
        ) : null}
        {children}
      </CellContainer>
    );
  }
);

const InvalidIndicator = styled.div`
  height: 0;
  width: 0;
  border-top: 6px solid red;
  border-left: 6px solid transparent;
  position: absolute;
  right: 0;
  top: 0;
`;

const CellContainer = styled.div`
  padding: 4px 8px;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
