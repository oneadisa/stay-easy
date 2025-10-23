import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { DarkTheme, LightTheme, Theme } from '../utils/theme';

type Ctx = { 
  theme: Theme; 
  setMode: (m: 'light' | 'dark' | 'system') => void; 
  mode: 'light' | 'dark' | 'system' 
};

const ThemeCtx = createContext<Ctx>({ 
  theme: LightTheme, 
  setMode: () => {}, 
  mode: 'system' 
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light'|'dark'|'system'>('system');
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme() ?? 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme ?? 'light');
    });
    return () => sub.remove();
  }, []);

  const theme = useMemo(() => {
    const effective = mode === 'system' ? colorScheme : mode;
    return effective === 'dark' ? DarkTheme : LightTheme;
  }, [mode, colorScheme]);

  return (
    <ThemeCtx.Provider value={{ theme, setMode, mode }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
