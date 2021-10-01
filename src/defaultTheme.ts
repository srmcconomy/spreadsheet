import { ITheme } from "./ITheme";

export const defaultTheme: ITheme = {
  selection: {
    primary: {
      borderColor: "#1a73e8",
      borderWidth: 2,
    },
    secondary: {
      borderColor: "#1a73e8",
      borderWidth: 1,
      backgroundColor: "rgba(14, 101, 235, 0.1)",
    },
  },

  cells: {
    borderColor: "#dddddd",
    backgroundColor: "white",
  },

  headers: {
    borderColor: "#dddddd",
    backgroundColor: "white",
  },

  errorColor: "red",
};
