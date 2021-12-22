import { ISelection } from "./ISelection";
import { usePropsRef } from "./PropsContext";

const offsetMapping = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(Math.min(n, max), min);

const baseOffsetSelection = (
  selection: ISelection,
  direction: "up" | "down" | "left" | "right",
  numRows: number,
  numColumns: number,
  numUnselectableColumns: number
) => {
  const mapping = offsetMapping[direction];
  const coordinates = {
    x: clamp(
      selection.primary.x + mapping.x,
      numUnselectableColumns,
      numColumns - 1
    ),
    y: clamp(selection.primary.y + mapping.y, 0, numRows - 1),
  };
  return {
    start: coordinates,
    primary: coordinates,
    height: 1,
    width: 1,
  };
};

const baseOffsetShiftSelection = (
  selection: ISelection,
  direction: "up" | "down" | "left" | "right",
  numRows: number,
  numColumns: number,
  numUnselectableColumns: number
) => {
  switch (direction) {
    case "up":
      if (selection.start.y + selection.height - 1 > selection.primary.y) {
        return {
          ...selection,
          height: selection.height - 1,
        };
      }
      if (selection.start.y === 0) {
        return selection;
      }
      return {
        ...selection,
        start: {
          x: selection.start.x,
          y: selection.start.y - 1,
        },
        height: selection.height + 1,
      };
    case "down":
      if (selection.start.y < selection.primary.y) {
        return {
          ...selection,
          start: {
            x: selection.start.x,
            y: selection.start.y + 1,
          },
          height: selection.height - 1,
        };
      }
      if (selection.start.y + selection.height === numRows) {
        return selection;
      }
      return {
        ...selection,
        height: selection.height + 1,
      };
    case "left":
      if (selection.start.x + selection.width - 1 > selection.primary.x) {
        return {
          ...selection,
          width: selection.width - 1,
        };
      }
      if (selection.start.x === numUnselectableColumns) {
        return selection;
      }
      return {
        ...selection,
        start: {
          x: selection.start.x - 1,
          y: selection.start.y,
        },
        width: selection.width + 1,
      };
    case "right":
      if (selection.start.x < selection.primary.x) {
        return {
          ...selection,
          start: {
            x: selection.start.x + 1,
            y: selection.start.y,
          },
          width: selection.width - 1,
        };
      }
      if (selection.start.x + selection.width === numColumns) {
        return selection;
      }
      return {
        ...selection,
        width: selection.width + 1,
      };
  }
};

export const useSelectionUtils = () => {
  const propsRef = usePropsRef();
  return {
    offsetShiftSelection: (
      selection: ISelection,
      mapping: "left" | "right" | "up" | "down"
    ) =>
      baseOffsetShiftSelection(
        selection,
        mapping,
        propsRef.current.rows.length,
        propsRef.current.columnProps.length,
        propsRef.current.numUnselectableColumns
      ),

    offsetSelection: (
      selection: ISelection,
      mapping: "left" | "right" | "up" | "down"
    ) =>
      baseOffsetSelection(
        selection,
        mapping,
        propsRef.current.rows.length,
        propsRef.current.columnProps.length,
        propsRef.current.numUnselectableColumns
      ),
  };
};
