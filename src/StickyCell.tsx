import React, { useEffect, useRef } from "react";
import { CellWrapper } from "./CellWrapper";
import { stickyColumnContext } from "./StickyColumnContext";
import { viewportSizeContext } from "./ViewportContext";

type IProps = {
  x: number;
  y: number;
  hasError: boolean;
  children: React.ReactNode;
  numHeaders: number;
  isSelectable: boolean;
  borderRightColor?: string;
};

export const StickyCell = ({
  x,
  y,
  hasError,
  numHeaders,
  children,
  isSelectable,
  borderRightColor,
}: IProps) => {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const stickyCellWidths = stickyColumnContext.useState();
  const setStickyCellWidths = stickyColumnContext.useSetter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportSize = viewportSizeContext.useState();

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    if (y % viewportSize === 0) {
      const updateStickyWidths = () =>
        setStickyCellWidths((widths) => {
          if (!wrapperRef.current) {
            return widths;
          }
          const newWidths = [...widths];
          newWidths[x] = wrapperRef.current.offsetWidth;
          return newWidths;
        });
      resizeObserverRef.current = new ResizeObserver(updateStickyWidths);
      resizeObserverRef.current.observe(wrapperRef.current);
      updateStickyWidths();
      return () => resizeObserverRef.current?.disconnect();
    }
    return;
  }, [y % viewportSize]);

  const yPosition = (y % viewportSize) + 1 + numHeaders;
  const left = stickyCellWidths.slice(0, x).reduce((acc, v) => acc + v, 0);

  return (
    <CellWrapper
      ref={wrapperRef}
      x={x}
      y={y}
      hasError={hasError}
      style={{
        gridRow: `${yPosition} / ${yPosition + 1}`,
        gridColumn: `${x + 1} / ${x + 2}`,
        transform: `translateY(${
          Math.floor(y / viewportSize) * viewportSize * 100
        }%)`,
        position: "sticky",
        left,
        zIndex: 2,
      }}
      isSelectable={isSelectable}
      borderRightColor={borderRightColor}
    >
      {children}
    </CellWrapper>
  );
};
