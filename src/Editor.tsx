import React from "react";
import styled from "styled-components";
import { usePropsRef } from "./PropsContext";
import { IColumnProps } from "./IColumnProps";
import { useEditorKeyHandlers } from "./useEditorKeyHandlers";
import { editingCellContext } from "./EditorContext";

export const Editor = <TRow, TChange, TError>({
  columnProps,
  rows,
  numHeaders,
}: {
  columnProps: IColumnProps<TRow, TChange, TError>[];
  rows: TRow[];
  numHeaders: number;
}) => {
  const editingCell = editingCellContext.useState();
  const setEditingCell = editingCellContext.useSetter();
  const propsRef = usePropsRef<TRow, TChange, TError>();
  useEditorKeyHandlers<TRow, TChange, TError>();

  if (editingCell) {
    return (
      <Container
        key={`${editingCell.x},${editingCell.y}`}
        style={{
          gridColumn: `${editingCell.x + 1} / ${editingCell.x + 2}`,
          gridRow: `${editingCell.y + numHeaders + 1} / ${
            editingCell.y + numHeaders + 2
          }`,
        }}
      >
        {columnProps[editingCell.x].renderEditor({
          row: rows[editingCell.y],
          onChange: (row) => propsRef.current.onChange([row]),
          onBlur: () => {
            setEditingCell(null);
          },
        })}
      </Container>
    );
  }
  return null;
};

const Container = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  bottom: 0;
  right: 0;
  z-index: 4;
  box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
`;
