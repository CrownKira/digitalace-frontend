export const darkTheme = {
  palette: {
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#FBBA72",
    },
    type: "dark" as const, // Switching the dark mode on is a single property value change.
  },
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        color: "#ffffffb3",
        backgroundColor: "#616161e6",
      },
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit",
        },
      },
    },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};

export const lightTheme = {
  typography: {
    // fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontFamily: `Inter,"Source Sans Pro",Helvetica,Arial,sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: "#4f3cc9",
    },
    secondary: {
      light: "#5f5fc4",
      main: "#283593",
      dark: "#001064",
      contrastText: "#fff",
    },
    background: {
      default: "#fcfcfe",
    },
    type: "light" as const,
  },
  shape: {
    borderRadius: 10,
  },
  overrides: {
    RaLayout: {
      root: {
        background:
          "linear-gradient(to right, #FFFFFF, #ECE9E6)" /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */,
      },
    },
    RaLabeled: {
      label: {
        fontSize: "1.25rem",
      },
    },
    RaMenuItemLink: {
      root: {
        borderLeft: "3px solid #fff",
      },
      active: {
        borderLeft: "3px solid #4f3cc9",
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "none",
      },
      root: {
        border: "1px solid #e0e0e3",
        backgroundClip: "padding-box",
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: "#fff",
        color: "#4f3cc9",
        boxShadow: "none",
      },
    },
    MuiButtonBase: {
      root: {
        "&:hover:active::after": {
          // recreate a static ripple color
          // use the currentColor to make it work both for outlined and contained buttons
          // but to dim the background without dimming the text,
          // put another element on top with a limited opacity
          content: '""',
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          backgroundColor: "currentColor",
          opacity: 0.3,
          borderRadius: "inherit",
        },
      },
    },
    MuiAppBar: {
      colorSecondary: {
        color: "#808080",
        backgroundColor: "#fff",
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: "#f5f5f5",
      },
      barColorPrimary: {
        backgroundColor: "#d7d7d7",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "rgba(0, 0, 0, 0)",
        "&$disabled": {
          backgroundColor: "rgba(0, 0, 0, 0)",
          color: "rgba(0, 0, 0, 0.87)",
          "&$underline::before": {
            borderBottomStyle: "none",
          },
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        border: "none",
      },
    },
    RaDatagrid: { headerCell: { backgroundColor: "#fcfcfe" } },
  },
  props: {
    MuiButtonBase: {
      // disable ripple for perf reasons
      disableRipple: true,
    },
  },
};
