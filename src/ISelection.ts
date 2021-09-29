import { ICoordinates } from "./ICoordinates";

export type ISelection = {
  start: ICoordinates;
  height: number;
  width: number;
  primary: ICoordinates;
};
