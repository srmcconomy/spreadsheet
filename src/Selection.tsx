import React, { useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { useEditingCell } from "./EditorContext";
import { ISelection } from "./ISelection";
import { useScrollerRef } from "./Scroller";
import { isSelectingContext, selectionContext } from "./SelectionContext";
import { stickyColumnContext } from "./StickyColumnContext";

export const Selection = ({
  numStickyColumns,
}: {
  numStickyColumns: number;
}) => {
  const selection = selectionContext.useState();
  const isSelecting = isSelectingContext.useState();
  const setSelection = selectionContext.useSetter();
  const primarySelectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useScrollerRef();
  const previousSelectionRef = useRef<ISelection | null>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);
  const editingCell = useEditingCell();
  const stickyColumnWidths = stickyColumnContext.useState();

  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (e.target && !scrollerRef.current?.contains(e.target as Node)) {
        setSelection(null);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, []);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.screenX, y: e.screenY };
    };
    document.addEventListener("mousemove", listener);
    return () => document.removeEventListener("mousemove", listener);
  }, []);

  useEffect(() => {
    if (isSelecting) {
      const timeout = setInterval(() => {
        if (
          scrollerRef.current &&
          lastMousePosRef.current.x > scrollerRef.current.clientWidth
        ) {
          setSelection((s) => s && { ...s, width: s.width + 1 });
        }
      }, 100);
      return () => clearInterval(timeout);
    }
    return;
  }, [isSelecting]);

  useLayoutEffect(() => {
    if (
      selection &&
      scrollerRef.current &&
      previousSelectionRef.current &&
      topLeftRef.current &&
      bottomRightRef.current
    ) {
      const topPosition =
        topLeftRef.current.offsetTop +
        selection.start.y * topLeftRef.current.offsetHeight;

      const bottomPosition =
        bottomRightRef.current.offsetTop +
        (selection.start.y + selection.height) *
          bottomRightRef.current.offsetHeight;

      const headerHeight = topLeftRef.current.offsetHeight;
      if (selection.height >= previousSelectionRef.current.height) {
        if (selection.start.y < previousSelectionRef.current.start.y) {
          if (topPosition - headerHeight < scrollerRef.current.scrollTop) {
            scrollerRef.current.scrollTop = topPosition - headerHeight;
          }
        } else if (
          bottomPosition >
          scrollerRef.current.scrollTop + scrollerRef.current.clientHeight
        ) {
          scrollerRef.current.scrollTop =
            bottomPosition - scrollerRef.current.clientHeight;
        }
      } else {
        if (selection.start.y > previousSelectionRef.current.start.y) {
          if (
            topPosition + topLeftRef.current.offsetHeight >
            scrollerRef.current.scrollTop + scrollerRef.current.clientHeight
          ) {
            scrollerRef.current.scrollTop =
              topPosition +
              topLeftRef.current.offsetHeight -
              scrollerRef.current.clientHeight;
          }
        } else if (
          bottomPosition - bottomRightRef.current.offsetHeight - headerHeight <
          scrollerRef.current.scrollTop
        ) {
          scrollerRef.current.scrollTop =
            bottomPosition - bottomRightRef.current.offsetHeight - headerHeight;
        }
      }

      const leftPosition = topLeftRef.current.offsetLeft;
      const rightPosition =
        bottomRightRef.current.offsetLeft + bottomRightRef.current.offsetWidth;
      const stickyColumnWidth = stickyColumnWidths.reduce(
        (acc, v) => acc + v,
        0
      );

      if (
        selection.width > previousSelectionRef.current.width ||
        (selection.width === previousSelectionRef.current.width &&
          selection.start.y < previousSelectionRef.current.start.y)
      ) {
        if (selection.start.x < previousSelectionRef.current.start.x) {
          if (
            leftPosition - stickyColumnWidth <
            scrollerRef.current.scrollLeft
          ) {
            scrollerRef.current.scrollLeft = leftPosition - stickyColumnWidth;
          }
        } else if (
          rightPosition >
          scrollerRef.current.scrollLeft + scrollerRef.current.clientWidth
        ) {
          scrollerRef.current.scrollLeft =
            rightPosition - scrollerRef.current.clientWidth;
        }
      } else {
        if (selection.start.x > previousSelectionRef.current.start.x) {
          if (
            leftPosition + topLeftRef.current.offsetWidth >
            scrollerRef.current.scrollLeft + scrollerRef.current.clientWidth
          ) {
            scrollerRef.current.scrollLeft =
              leftPosition +
              topLeftRef.current.offsetWidth -
              scrollerRef.current.clientWidth;
          }
        } else if (
          rightPosition -
            bottomRightRef.current.offsetWidth -
            stickyColumnWidth <
          scrollerRef.current.scrollLeft
        ) {
          scrollerRef.current.scrollLeft =
            rightPosition -
            bottomRightRef.current.offsetWidth -
            stickyColumnWidth;
        }
      }
    }
    previousSelectionRef.current = selection;
  }, [selection, stickyColumnWidths]);

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
                gridColumn: `${selection.start.x + 1} / ${
                  1 +
                  Math.min(
                    selection.start.x + selection.width,
                    numStickyColumns
                  )
                }`,
                gridRow: `2 / ${2 + selection.height}`,
                transform: `translate(-1px, calc(${
                  selection.start.y * (100 / selection.height)
                }% - ${1 + selection.start.y / selection.height}px))`,
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
              gridColumn: `${selection.start.x + 1} / ${
                selection.start.x + 1 + selection.width
              }`,
              gridRow: `2 / ${2 + selection.height}`,
              transform: `translate(-1px, calc(${
                selection.start.y * (100 / selection.height)
              }% - ${1 + selection.start.y / selection.height}px))`,
              zIndex: 2,
            }}
            isSelecting={isSelecting}
          />
        </>
      ) : null}
      <InvisibleSquare
        ref={topLeftRef}
        style={{
          gridColumn: `${selection.start.x + 1} / ${selection.start.x + 2}`,
          gridRow: "2 / 3",
          transform: `translateY(${selection.start.y * 100}%)`,
        }}
      />
      <InvisibleSquare
        ref={bottomRightRef}
        style={{
          gridColumn: `${selection.start.x + selection.width} / ${
            selection.start.x + selection.width + 1
          }`,
          gridRow: "2 / 3",
          transform: `translateY(${
            (selection.start.y - 1 + selection.height) * 100
          }%)`,
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
          gridColumn: `${selection.primary.x + 1} / ${selection.primary.x + 2}`,
          gridRow: "2 / 3",
          transform: `translate(-1px, calc(${selection.primary.y * 100}% - ${
            selection.primary.y + 1
          }px))`,
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  user-select: none;
  pointer-events: none;
`;

const SelectionSquare = styled.div<{
  isSelecting: boolean;
  hasRightBorder?: boolean;
}>`
  background: rgba(14, 101, 235, 0.1);
  user-select: none;
  pointer-events: none;
  border: ${({ isSelecting }) => (isSelecting ? "0" : "1px solid #1a73e8")};
  ${({ hasRightBorder = true }) => (hasRightBorder ? "" : "border-right: 0;")}
  height: calc(100% + 1px);
  width: calc(100% + 1px);
  box-sizing: border-box;
`;

const PrimarySelectionSquare = styled.div`
  user-select: none;
  pointer-events: none;
  box-sizing: border-box;
  height: calc(100% + 1px);
  width: calc(100% + 1px);
  border: 2px solid #1a73e8;
`;
