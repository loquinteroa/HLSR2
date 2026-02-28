import React, {  useState } from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { themeCreator } from './base';

export const ThemeContext = React.createContext(
  (themeName: string): void => {}
);
type Props = {
  children?: React.ReactNode
};
const ThemeProviderWrapper: React.FC<Props> = ({children}) => {
  const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
