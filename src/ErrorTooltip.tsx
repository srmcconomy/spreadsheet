import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { errorTooltipContext } from "./ErrorTooltipContext";
import { IColumnProps } from "./IColumnProps";
import { isSelectingContext } from "./SelectionContext";

export const ErrorTooltip = <TRow, TError>({
  columnProps,
}: {
  columnProps: IColumnProps<TRow, TError>[];
}) => {
  const { el, error, x } = errorTooltipContext.useState() ?? {};
  const isSelecting = isSelectingContext.useState();
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes } = usePopper(error ? el : null, tooltipElement, {
    placement: "bottom-start",
  });

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timeout);
    }
    setVisible(false);
    return;
  }, [error]);

  return ReactDOM.createPortal(
    <TooltipContainer
      style={styles.popper}
      {...attributes}
      ref={setTooltipElement}
      visible={!!error && visible && !isSelecting}
    >
      {error && x !== undefined && columnProps[x].renderErrorTooltip(error)}
    </TooltipContainer>,
    document.body
  );
};

const TooltipContainer = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "block" : "none")};
  z-index: 10;
`;
