export type ITheme = {
  headers: {
    backgroundColor: string;
    intraGroupBorderColor: string;
    interGroupBorderColor: string;
    outerBorderColor: string;
  };

  cells: {
    backgroundColor: string;
    intraGroupBorderColor: string;
    interGroupBorderColor: string;
    outerBorderColor: string;
    stickyBorderColor: string;
  };

  selection: {
    primary: {
      borderWidth: number;
      borderColor: string;
    };
    secondary: {
      borderWidth: number;
      borderColor: string;
      backgroundColor: string;
    };
  };
};
