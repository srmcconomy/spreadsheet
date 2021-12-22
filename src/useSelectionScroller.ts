import { useLayoutEffect, useRef } from "react";
import { useScrollerRef } from "./Scroller";
import { selectionContext } from "./SelectionContext";
import { stickyColumnContext } from "./StickyColumnContext";

const getNewPosition = ({
  selectionStartRect,
  selectionEndRect,
  prevSelectionStart,
  prevSelectionEnd,
  viewportStart,
  viewportEnd,
}: {
  selectionStartRect: { start: number; end: number };
  selectionEndRect: { start: number; end: number };
  prevSelectionStart: number;
  prevSelectionEnd: number;
  viewportStart: number;
  viewportEnd: number;
}) => {
  if (
    selectionStartRect.start < prevSelectionStart &&
    selectionStartRect.start < viewportStart
  ) {
    return selectionStartRect.start;
  }
  if (
    selectionStartRect.start > prevSelectionStart &&
    selectionStartRect.end > viewportEnd
  ) {
    return selectionStartRect.end - (viewportEnd - viewportStart);
  }
  if (
    selectionEndRect.end > prevSelectionEnd &&
    selectionEndRect.end > viewportEnd
  ) {
    return selectionEndRect.end - (viewportEnd - viewportStart);
  }
  if (
    selectionEndRect.end < prevSelectionEnd &&
    selectionEndRect.start < viewportStart
  ) {
    return selectionEndRect.start;
  }
  return null;
};

export const useSelectionScroller = ({
  headers,
  topLeftRef,
  bottomRightRef,
}: {
  headers: { height: number }[];
  topLeftRef: { readonly current: HTMLDivElement | null };
  bottomRightRef: { readonly current: HTMLDivElement | null };
}) => {
  const selection = selectionContext.useState();
  const scrollerRef = useScrollerRef();
  const prevSelectionRectRef = useRef<{
    top: number;
    bottom: number;
    left: number;
    right: number;
  } | null>(null);
  const stickyColumnWidths = stickyColumnContext.useState();

  useLayoutEffect(() => {
    if (
      !topLeftRef.current ||
      !bottomRightRef.current ||
      !scrollerRef.current
    ) {
      return;
    }

    const topLeftRect = topLeftRef.current.getBoundingClientRect();
    const bottomRightRect = bottomRightRef.current.getBoundingClientRect();
    const scrollerRect = scrollerRef.current.getBoundingClientRect();

    const headerHeight = headers.reduce((acc, { height }) => acc + height, 0);

    const screenToTableY = (y: number) =>
      y - scrollerRect.top - headerHeight + scrollerRef.current!.scrollTop;

    const selectionTop = {
      start: screenToTableY(topLeftRect.top),
      end: screenToTableY(topLeftRect.bottom),
    };
    const selectionBottom = {
      start: screenToTableY(bottomRightRect.top),
      end: screenToTableY(bottomRightRect.bottom),
    };

    const stickyColumnWidth = stickyColumnWidths.reduce((acc, v) => acc + v, 0);

    const screenToTableX = (x: number) =>
      x -
      scrollerRect.left -
      stickyColumnWidth +
      scrollerRef.current!.scrollLeft;

    const selectionLeft = {
      start: screenToTableX(topLeftRect.left),
      end: screenToTableX(topLeftRect.right),
    };
    const selectionRight = {
      start: screenToTableX(bottomRightRect.left),
      end: screenToTableX(bottomRightRect.right),
    };

    if (prevSelectionRectRef.current) {
      const newScrollTop = getNewPosition({
        selectionStartRect: selectionTop,
        selectionEndRect: selectionBottom,
        prevSelectionStart: prevSelectionRectRef.current.top,
        prevSelectionEnd: prevSelectionRectRef.current.bottom,
        viewportStart: scrollerRef.current.scrollTop,
        viewportEnd:
          scrollerRef.current.scrollTop +
          scrollerRef.current.clientHeight -
          headerHeight,
      });

      if (newScrollTop !== null) {
        scrollerRef.current.scrollTop = newScrollTop;
      }

      const newScrollLeft = getNewPosition({
        selectionStartRect: selectionLeft,
        selectionEndRect: selectionRight,
        prevSelectionStart: prevSelectionRectRef.current.left,
        prevSelectionEnd: prevSelectionRectRef.current.right,
        viewportStart: scrollerRef.current.scrollLeft,
        viewportEnd:
          scrollerRef.current.scrollLeft +
          scrollerRef.current.clientWidth -
          stickyColumnWidth,
      });

      if (newScrollLeft !== null) {
        scrollerRef.current.scrollLeft = newScrollLeft;
      }
    }
    prevSelectionRectRef.current = {
      top: selectionTop.start,
      bottom: selectionBottom.end,
      left: selectionLeft.start,
      right: selectionRight.end,
    };
  }, [selection, stickyColumnWidths, headers]);
};
