import { ICoordinates } from "./ICoordinates";
import { createStateContext } from "./StateContext";

export const editingCellContext = createStateContext<ICoordinates | null>(null);
