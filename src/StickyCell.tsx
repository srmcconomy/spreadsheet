import React, { useEffect, useRef } from "react";
import { CellWrapper } from "./CellWrapper";
import { stickyColumnContext } from "./StickyColumnContext";

type IProps<TError> = {
  x: number;
  y: number;
  error: TError | null;
  children: React.ReactNode;
};

export const StickyCell = <TError extends unknown>({
  x,
  y,
  error,
  children,
}: IProps<TError>) => {
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const stickyCellWidths = stickyColumnContext.useState();
  const setStickyCellWidths = stickyColumnContext.useSetter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    if (y % 20 === 0) {
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
  }, [y % 20]);

  const yPosition = (y % 20) + 2;
  const left = stickyCellWidths.slice(0, x).reduce((acc, v) => acc + v, 0);

  return (
    <CellWrapper
      ref={wrapperRef}
      x={x}
      y={y}
      error={error}
      style={{
        gridRow: `${yPosition} / ${yPosition + 1}`,
        gridColumn: `${x + 1} / ${x + 2}`,
        transform: `translateY(${Math.floor(y / 20) * 20 * 100}%)`,
        position: "sticky",
        left,
        zIndex: 2,
      }}
    >
      {children}
    </CellWrapper>
  );
};
