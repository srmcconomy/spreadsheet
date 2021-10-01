import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { editingCellContext } from "./EditorContext";
import { useScrollerRef } from "./Scroller";
import { isSelectingContext, selectionContext } from "./SelectionContext";
import { stickyColumnContext } from "./StickyColumnContext";
import { useSelectionKeyHandlers } from "./useSelectionKeyHandlers";
import { useSelectionMouseMove } from "./useSelectionMouseMove";
import { useSelectionScroller } from "./useSelectionScroller";

export const Selection = ({
  numStickyColumns,
  headers,
  rowHeight,
}: {
  numStickyColumns: number;
  headers: { height: number }[];
  rowHeight: number;
}) => {
  const selection = selectionContext.useState();
  const setIsSelecting = isSelectingContext.useSetter();
  const isSelecting = isSelectingContext.useState();
  const isSelectingRef = isSelectingContext.useRef();
  const setSelection = selectionContext.useSetter();
  const primarySelectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useScrollerRef();
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const editingCell = editingCellContext.useState();
  const stickyColumnWidths = stickyColumnContext.useState();

  useSelectionScroller({ topLeftRef, bottomRightRef, headers });
  useSelectionMouseMove();
  useSelectionKeyHandlers();

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (isSelectingRef.current) {
        setIsSelecting(false);
      } else if (e.target && !scrollerRef.current?.contains(e.target as Node)) {
        setSelection(null);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, []);

  const createPositionStyle = ({
    start,
    height,
    width,
  }: {
    start: { x: number; y: number };
    height: number;
    width: number;
  }): React.CSSProperties => ({
    gridColumn: `${start.x + 1} / ${start.x + 1 + width}`,
    gridRow: `${1 + headers.length} / ${1 + headers.length + height}`,
    transform: `translate(-1px, ${start.y * rowHeight - 1}px)`,
  });

  if (!selection) {
    return null;
  }

  return (
    <>
      {selection.width > 1 || selection.height > 1 ? (
        <>
          {selection.start.x < numStickyColumns ? (
            <SelectionSquare
              style={{
                ...createPositionStyle({
                  start: selection.start,
                  width: Math.min(
                    selection.width,
                    numStickyColumns - selection.start.x
                  ),
                  height: selection.height,
                }),
                left: stickyColumnWidths
                  .slice(0, selection.start.x)
                  .reduce((acc, v) => acc + v, 0),
                zIndex: 3,
                position: "sticky",
              }}
              isSelecting={isSelecting}
              hasRightBorder={
                selection.start.x + selection.width <= numStickyColumns
              }
            />
          ) : null}
          <SelectionSquare
            style={{
              ...createPositionStyle({
                start: selection.start,
                height: selection.height,
                width: selection.width,
              }),
              zIndex: 2,
            }}
            isSelecting={isSelecting}
          />
        </>
      ) : null}
      <InvisibleSquare
        ref={topLeftRef}
        style={{
          ...createPositionStyle({
            start: selection.start,
            height: 1,
            width: 1,
          }),
        }}
      />
      <InvisibleSquare
        ref={bottomRightRef}
        style={{
          ...createPositionStyle({
            start: {
              x: selection.start.x + selection.width - 1,
              y: selection.start.y + selection.height - 1,
            },
            height: 1,
            width: 1,
          }),
        }}
      />

      <PrimarySelectionSquare
        ref={primarySelectionRef}
        style={{
          position:
            selection.primary.x < numStickyColumns ? "sticky" : undefined,
          left:
            selection.primary.x < numStickyColumns
              ? stickyColumnWidths
                  .slice(0, selection.primary.x)
                  .reduce((acc, v) => acc + v, 0)
              : undefined,
          ...createPositionStyle({
            start: selection.primary,
            height: 1,
            width: 1,
          }),
          zIndex:
            selection.primary.x === editingCell?.x &&
            selection.primary.y === editingCell?.y
              ? 5
              : selection.primary.x < numStickyColumns
              ? 3
              : 2,
        }}
      />
    </>
  );
};

const InvisibleSquare = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  user-select: none;
  pointer-events: none;
`;

const SelectionSquare = styled.div<{
  isSelecting: boolean;
  hasRightBorder?: boolean;
}>`
  background: ${({ theme }) => theme.selection.secondary.backgroundColor};
  user-select: none;
  pointer-events: none;
  border: ${({ isSelecting, theme }) =>
    isSelecting
      ? "0"
      : `${theme.selection.secondary.borderWidth}px solid ${theme.selection.secondary.borderColor}`};
  ${({ hasRightBorder = true }) => (hasRightBorder ? "" : "border-right: 0;")}
  height: calc(100% + 1px);
  width: calc(100% + 1px);
  box-sizing: border-box;
  position: absolute;
`;

const PrimarySelectionSquare = styled.div`
  user-select: none;
  pointer-events: none;
  box-sizing: border-box;
  height: calc(100% + 1px);
  width: calc(100% + 1px);
  border: ${({ theme }) =>
    `${theme.selection.primary.borderWidth}px solid ${theme.selection.primary.borderColor}`};
  position: absolute;
`;
