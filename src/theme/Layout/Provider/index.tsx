import { useColorMode } from "@docusaurus/theme-common";
import { createTheme, ThemeProvider } from "@mui/material";
import { blue } from "@mui/material/colors";
import Provider from "@theme-original/Layout/Provider";
import React from "react";

function DarkProvider(props) {
  const {colorMode} = useColorMode();
  const theme = React.useMemo(() => createTheme({
    palette: {
      primary: {
        main: colorMode === "dark" ? blue[300] : blue[500]
      },
      mode: colorMode,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000, // 从 900 改到 1000 是为了匹配 Docusaurus 的默认主题
        lg: 1200,
        xl: 1536,
      },
    },
  }), [colorMode]);

  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}

export default function ProviderWrapper(props) {
  const {children, ...other} = props;
  return (
    <Provider {...other}>
      <DarkProvider>
        {children}
      </DarkProvider>
    </Provider>
  );
}
