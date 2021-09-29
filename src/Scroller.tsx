import React, { useMemo, useRef, useContext } from "react";
import styled from "styled-components";
import { errorTooltipContext } from "./ErrorTooltipContext";
import { usePropsRef } from "./PropsContext";
import { viewportContext } from "./ViewportContext";

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
  const setViewPortStart = viewportContext.useSetter();
  const setErrorTooltip = errorTooltipContext.useSetter();
  const { rowHeight } = usePropsRef().current;
  const scrollerRef = useRef<HTMLDivElement>(null);

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
        onMouseLeave={() => setErrorTooltip(null)}
        onScroll={(e) => {
          setErrorTooltip(null);
          handleScroll(e.currentTarget.scrollTop);
        }}
      >
        {children}
      </ScrollerContainer>
    </scrollerRefContext.Provider>
  );
};

const ScrollerContainer = styled.div`
  height: 70vh;
  overflow: auto;
  width: 500px;
  border-top: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
`;
