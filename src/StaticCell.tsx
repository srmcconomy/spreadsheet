import { CellWrapper } from "./CellWrapper";

type IProps<TError> = {
  x: number;
  y: number;
  error: TError | null;
  children: React.ReactNode;
};

export const StaticCell = <TError extends unknown>({
  x,
  y,
  error,
  children,
}: IProps<TError>) => (
  <CellWrapper
    style={{
      gridRowStart: (y % 20) + 2,
      gridColumnStart: x + 1,
      transform: `translateY(${Math.floor(y / 20) * 20 * 100}%)`,
    }}
    x={x}
    y={y}
    error={error}
  >
    {children}
  </CellWrapper>
);
