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
    interGroupBorderColor: "#dddddd",
    intraGroupBorderColor: "#dddddd",
    stickyBorderColor: "#dddddd",
    outerBorderColor: "#dddddd",
    backgroundColor: "white",
  },

  headers: {
    interGroupBorderColor: "#dddddd",
    intraGroupBorderColor: "#dddddd",
    outerBorderColor: "#dddddd",
    backgroundColor: "white",
  },
};
