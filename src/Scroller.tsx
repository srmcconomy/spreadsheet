import React, { useMemo, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { hoveredCellContext } from "./hoveredCellContext";
import { usePropsRef } from "./PropsContext";
import { viewportStartContext, viewportSizeContext } from "./ViewportContext";

const debounce = <TArgs extends any[]>(f: (...args: TArgs) => void) => {
  let lastArgs: TArgs;
  let calling = false;
  return (...args: TArgs) => {
    lastArgs = args;
    if (!calling) {
      calling = true;
      requestAnimationFrame(() => {
        calling = false;
        f(...lastArgs);
      });
    }
  };
};

const scrollerRefContext = React.createContext<{
  readonly current: HTMLDivElement | null;
}>({ current: null });

export const useScrollerRef = () => useContext(scrollerRefContext);

export const Scroller = ({ children }: { children: React.ReactNode }) => {
  const setViewPortStart = viewportStartContext.useSetter();
  const setViewportSize = viewportSizeContext.useSetter();
  const setHoveredCell = hoveredCellContext.useSetter();
  const { rowHeight } = usePropsRef().current;
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        if (!scrollerRef.current) {
          return;
        }
        setViewportSize(
          Math.ceil(scrollerRef.current.clientHeight / rowHeight)
        );
      })
    );
    resizeObserver.observe(scrollerRef.current);
    return () => resizeObserver.disconnect();
  }, [rowHeight]);

  const handleScroll = useMemo(
    () =>
      debounce((top: number) => {
        setViewPortStart(Math.floor(top / rowHeight));
      }),
    []
  );
  return (
    <scrollerRefContext.Provider value={scrollerRef}>
      <ScrollerContainer
        ref={scrollerRef}
        onMouseLeave={() => setHoveredCell(null)}
        onScroll={(e) => {
          setHoveredCell(null);
          handleScroll(e.currentTarget.scrollTop);
        }}
      >
        {children}
      </ScrollerContainer>
    </scrollerRefContext.Provider>
  );
};

const ScrollerContainer = styled.div`
  overflow: auto;
  border-top: 1px solid ${({ theme }) => theme.cells.borderColor};
  border-left: 1px solid ${({ theme }) => theme.cells.borderColor};
  background: ${({ theme }) => theme.cells.backgroundColor};
`;
