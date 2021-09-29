import { ISelection } from "./ISelection";
import { createStateContext } from "./StateContext";

export const selectionContext = createStateContext<ISelection | null>(null);
export const isSelectingContext = createStateContext<boolean>(false);
