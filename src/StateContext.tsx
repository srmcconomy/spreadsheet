import React, { useContext, useMemo, useRef, useState } from "react";

export const createStateContext = <T extends unknown>(initialValue: T) => {
  const stateContext = React.createContext<T>(initialValue);
  const staticContext = React.createContext<{
    setState: React.Dispatch<React.SetStateAction<T>>;
    ref: { current: T };
  }>({
    setState: () => {},
    ref: { current: initialValue },
  });

  return {
    useState: () => useContext(stateContext),
    useRef: () => useContext(staticContext).ref as { readonly current: T },
    useSetter: () => {
      const { setState, ref } = useContext(staticContext);
      return (action: React.SetStateAction<T>) => {
        const newValue =
          typeof action === "function"
            ? (action as (val: T) => T)(ref.current)
            : action;
        ref.current = newValue;
        setState(newValue);
      };
    },
    Provider: ({ children }: { children: React.ReactNode }) => {
      const [state, setState] = useState(initialValue);
      const ref = useRef(initialValue);
      const staticValue = useMemo(() => ({ setState, ref }), []);

      return (
        <stateContext.Provider value={state}>
          <staticContext.Provider value={staticValue}>
            {children}
          </staticContext.Provider>
        </stateContext.Provider>
      );
    },
  };
};
