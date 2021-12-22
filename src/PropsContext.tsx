import React, { useContext, useEffect, useRef } from "react";
import { ITableProps } from "./ITableProps";

const propsRefContext = React.createContext({});

export const usePropsRef = <TRow, TChange, TError>() =>
  useContext<React.MutableRefObject<ITableProps<TRow, TChange, TError>>>(
    propsRefContext as unknown as React.Context<
      React.MutableRefObject<ITableProps<TRow, TChange, TError>>
    >
  );

export const PropsRefProvider = <TRow, TChange, TError>({
  props,
  children,
}: {
  props: ITableProps<TRow, TChange, TError>;
  children: React.ReactNode;
}) => {
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  return (
    <propsRefContext.Provider value={propsRef}>
      {children}
    </propsRefContext.Provider>
  );
};
