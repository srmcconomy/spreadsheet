import { CellWrapper } from "./CellWrapper";
import React from "react";
import { viewportSizeContext } from "./ViewportContext";

type IProps = {
  x: number;
  y: number;
  hasError: boolean;
  children: React.ReactNode;
  numHeaders: number;
  isSelectable: boolean;
  isReadonly: boolean;
  borderRightColor?: string;
};

export const StaticCell = ({
  x,
  y,
  numHeaders,
  hasError,
  children,
  isSelectable,
  isReadonly,
  borderRightColor,
}: IProps) => {
  const viewportSize = viewportSizeContext.useState();
  return (
    <CellWrapper
      style={{
        gridRowStart: (y % viewportSize) + 1 + numHeaders,
        gridColumnStart: x + 1,
        transform: `translateY(${
          Math.floor(y / viewportSize) * viewportSize * 100
        }%)`,
      }}
      x={x}
      y={y}
      hasError={hasError}
      isSelectable={isSelectable}
      isReadonly={isReadonly}
      borderRightColor={borderRightColor}
    >
      {children}
    </CellWrapper>
  );
};
