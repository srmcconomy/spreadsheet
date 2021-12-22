import { HeaderCell } from "./HeaderCell";
import { stickyColumnContext } from "./StickyColumnContext";
import React from "react";

export const Headers = ({
  headers,
  numStickyColumns,
}: {
  headers: {
    height: number;
    borderTopColor?: string;
    borderBottomColor?: string;
    row: {
      key: string;
      component: React.ReactNode;
      columnSpan: number;
      borderLeftColor?: string;
      borderRightColor?: string;
    }[];
  }[];
  numStickyColumns: number;
}) => {
  let top = 0;
  return (
    <>
      {headers.map(({ row, height, borderBottomColor }, y) => {
        const currentTop = top;
        top += height;

        let currentX = 0;
        return row.map(({ key, component, columnSpan, borderRightColor }) => {
          const x = currentX;
          currentX += columnSpan;
          return x < numStickyColumns ? (
            <StickyHeader
              key={`${key}:${y}`}
              x={x}
              style={{
                top: currentTop,
                gridRowStart: `${y + 1}`,
                gridColumn: `${x + 1} / ${x + 1 + columnSpan}`,
              }}
              borderBottomColor={
                borderBottomColor ?? headers[y + 1]?.borderTopColor
              }
              borderRightColor={borderRightColor ?? row[x + 1]?.borderLeftColor}
            >
              {component}
            </StickyHeader>
          ) : (
            <HeaderCell
              key={key}
              style={{
                top: currentTop,
                zIndex: 2,
                gridRowStart: `${y + 1}`,
                gridColumn: `${x + 1} / ${x + 1 + columnSpan}`,
              }}
              borderBottomColor={
                borderBottomColor ?? headers[y + 1]?.borderTopColor
              }
              borderRightColor={borderRightColor ?? row[x + 1]?.borderLeftColor}
            >
              {component}
            </HeaderCell>
          );
        });
      })}
    </>
  );
};

const StickyHeader = ({
  x,
  style,
  children,
  borderRightColor,
  borderBottomColor,
}: {
  x: number;
  style: React.CSSProperties;
  children: React.ReactNode;
  borderBottomColor?: string;
  borderRightColor?: string;
}) => {
  const stickyWidths = stickyColumnContext.useState();
  const left = stickyWidths.slice(0, x).reduce((acc, v) => acc + v, 0);

  return (
    <HeaderCell
      style={{
        ...style,
        left,
        zIndex: 3,
      }}
      borderBottomColor={borderBottomColor}
      borderRightColor={borderRightColor}
    >
      {children}
    </HeaderCell>
  );
};
