import { HeaderCell } from "./HeaderCell";
import { IColumnProps } from "./IColumnProps";
import { stickyColumnContext } from "./StickyColumnContext";

export const Headers = <TRow, TError>({
  columnProps,
  numStickyColumns,
}: {
  columnProps: IColumnProps<TRow, TError>[];
  numStickyColumns: number;
}) => (
  <>
    {columnProps.map(({ key, renderHeader }, x) => {
      const content = renderHeader();
      return x < numStickyColumns ? (
        <StickyHeader key={key} x={x}>
          {content}
        </StickyHeader>
      ) : (
        <HeaderCell
          key={key}
          style={{
            zIndex: 2,
            gridColumn: `${x + 1} / ${x + 2}`,
          }}
        >
          {content}
        </HeaderCell>
      );
    })}
  </>
);

const StickyHeader = ({
  x,
  children,
}: {
  x: number;
  children: React.ReactNode;
}) => {
  const stickyWidths = stickyColumnContext.useState();
  const left = stickyWidths.slice(0, x).reduce((acc, v) => acc + v, 0);

  return (
    <HeaderCell
      style={{
        left,
        zIndex: 3,
      }}
    >
      {children}
    </HeaderCell>
  );
};
