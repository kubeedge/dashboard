import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    text: {
      primary: '#5B5B98',
      secondary: '#5B5B98',
      disabled: '#5B5B98',
      hint: '#5B5B98',
    },
    primary: {
      main: "#757FEF",
    },
    secondary: {
      main: "#818093",
    },
    success: {
      main: "#00B69B",
    },
    info: {
      main: "#2DB6F5",
    },
    warning: {
      main: "#FFBC2B",
    },
    danger: {
      main: "#EE368C",
    },
    dark: {
      main: "#260944",
    },
  },
  typography: {
    fontSize: 12
  }
})

export default theme
