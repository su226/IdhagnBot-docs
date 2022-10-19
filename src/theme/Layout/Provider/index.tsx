import { useColorMode } from '@docusaurus/theme-common';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Provider from '@theme-original/Layout/Provider';
import React from 'react';

function DarkProvider(props) {
  const {colorMode} = useColorMode();
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: colorMode,
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
