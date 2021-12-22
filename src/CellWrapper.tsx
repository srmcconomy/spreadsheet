import { isSelectingContext, selectionContext } from "./SelectionContext";
import styled from "styled-components";
import { editingCellContext } from "./EditorContext";
import React, { useRef } from "react";
import { hoveredCellContext } from "./hoveredCellContext";

type IProps = {
  x: number;
  y: number;
  style: React.CSSProperties;
  children: React.ReactNode;
  hasError: boolean;
  isSelectable: boolean;
  borderRightColor?: string;
  isReadonly: boolean;
};

export const CellWrapper = React.forwardRef(
  (
    {
      x,
      y,
      style,
      children,
      hasError,
      isSelectable,
      borderRightColor,
      isReadonly,
    }: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const setSelection = selectionContext.useSetter();
    const setIsSelecting = isSelectingContext.useSetter();
    const isSelectingRef = isSelectingContext.useRef();
    const editingCellRef = editingCellContext.useRef();
    const setEditingCell = editingCellContext.useSetter();
    const cellRef = useRef<HTMLDivElement | null>(null);
    const setHoveredCell = hoveredCellContext.useSetter();

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
        onMouseDown={
          isSelectable
            ? (e) => {
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
              }
            : undefined
        }
        onDoubleClick={
          isSelectable && !isReadonly
            ? () => {
                setEditingCell({ x, y });
              }
            : undefined
        }
        onMouseEnter={() => {
          if (cellRef.current) {
            setHoveredCell({ el: cellRef.current, x, y });
          }
          if (isSelectable && isSelectingRef.current) {
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
        borderRightColor={borderRightColor}
        isReadonly={isReadonly}
      >
        {hasError ? (
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
  border-top: 6px solid ${({ theme }) => theme.errorColor};
  border-left: 6px solid transparent;
  position: absolute;
  right: 0;
  top: 0;
`;

const CellContainer = styled.div<{
  borderRightColor?: string;
  isReadonly: boolean;
}>`
  border-right: 1px solid
    ${({ borderRightColor, theme }) =>
      borderRightColor ?? theme.cells.borderColor};
  border-bottom: 1px solid ${({ theme }) => theme.cells.borderColor};
  background: ${({ isReadonly, theme }) =>
    isReadonly
      ? theme.cells.readonlyBackgroundColor
      : theme.cells.backgroundColor};
  display: flex;
  align-items: center;
`;
