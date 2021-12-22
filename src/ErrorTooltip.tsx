import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { hoveredCellContext } from "./hoveredCellContext";
import { isSelectingContext } from "./SelectionContext";

export const ErrorTooltip = <TError extends unknown>({
  renderErrorTooltip,
  errors,
}: {
  renderErrorTooltip: (error: TError) => React.ReactNode;
  errors: (TError | null)[][];
}) => {
  const { el, x, y } = hoveredCellContext.useState() ?? {};
  const isSelecting = isSelectingContext.useState();
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null
  );
  const error = x !== undefined && y !== undefined ? errors[y][x] : null;
  const { styles, attributes } = usePopper(error ? el : null, tooltipElement, {
    placement: "bottom-start",
  });

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    if (error) {
      const timeout = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timeout);
    }
    return;
  }, [error, x, y, isSelecting]);

  return ReactDOM.createPortal(
    <TooltipContainer
      style={styles.popper}
      {...attributes}
      ref={setTooltipElement}
      visible={!!error && visible && !isSelecting}
    >
      {error && x !== undefined && renderErrorTooltip(error)}
    </TooltipContainer>,
    document.body
  );
};

const TooltipContainer = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  z-index: 10;
`;
