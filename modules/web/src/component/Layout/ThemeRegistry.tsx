'use client';

import React, { useMemo, useState, createContext, useContext } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type Mode = 'light' | 'dark';

const ThemeModeContext = createContext<
  { mode: Mode; setMode: (m: Mode) => void } | undefined
>(undefined);

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeRegistry');
  return ctx;
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f6f7',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#000000',
            secondary: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          },
        },
        typography: {
          fontFamily: 'Roboto, sans-serif',
        },
        spacing: 8,
        breakpoints: {
          values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam: any) => ({
              'html, body, #__next': {
                backgroundColor: themeParam.palette.background.default,
                color: themeParam.palette.text.primary,
              },
            }),
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: 'none',
              }),
            },
          },
          MuiCardHeader: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                '& .MuiTableCell-root': {
                  color: theme.palette.text.primary,
                },
              }),
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              toolbar: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }),
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
