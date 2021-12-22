export type ITheme = {
  headers: {
    borderColor: string;
    backgroundColor: string;
  };

  cells: {
    borderColor: string;
    backgroundColor: string;
    readonlyBackgroundColor: string;
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

  errorColor: string;
};
