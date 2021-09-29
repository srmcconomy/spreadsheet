import { useEffect } from "react";
import { usePropsRef } from "./PropsContext";
import { selectionContext } from "./SelectionContext";

export const useCopy = <TRow, TError>() => {
  const selectionRef = selectionContext.useRef();
  const propsRef = usePropsRef<TRow, TError>();
  useEffect(() => {
    document.addEventListener("copy", (e) => {
      const selection = selectionRef.current;
      if (!selection) {
        return;
      }
      let copyText = [...new Array(selection.height)]
        .map((_, y) =>
          [...new Array(selection.width)]
            .map((_, x) =>
              propsRef.current.columnProps[selection.start.x + x].toString(
                propsRef.current.undoStack.rows[selection.start.y + y]
              )
            )
            .join("\t")
        )
        .join("\n");

      e.clipboardData?.setData("text/plain", copyText);
      e.preventDefault();
    });
  }, []);
};
