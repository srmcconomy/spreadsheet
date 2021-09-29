import { useEditingCell, useEditingCellRef } from "./EditorContext";
import styled from "styled-components";
import { usePropsRef } from "./PropsContext";
import { IColumnProps } from "./IColumnProps";

export const Editor = <TRow, TError>({
  columnProps,
  rows,
}: {
  columnProps: IColumnProps<TRow, TError>[];
  rows: TRow[];
}) => {
  const editingCell = useEditingCell();
  const { setEditingCell } = useEditingCellRef();
  const propsRef = usePropsRef<TRow, TError>();
  if (editingCell) {
    return (
      <Container
        x={editingCell.x}
        y={editingCell.y}
        key={`${editingCell.x},${editingCell.y}`}
      >
        {columnProps[editingCell.x].renderEditor({
          row: rows[editingCell.y],
          onChange: (row) =>
            propsRef.current.onChange([{ row, y: editingCell.y }]),
          onBlur: () => {
            setEditingCell(null);
          },
        })}
      </Container>
    );
  }
  return null;
};

const Container = styled.div<{ x: number; y: number }>`
  grid-column: ${({ x }) => `${x + 1} / ${x + 2}`};
  grid-row: ${({ y }) => `${y + 2} / ${y + 3}`};
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: 0;
  right: 0;
  z-index: 4;
  box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
`;
