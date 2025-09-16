'use client'

import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';
import SideNav from "@/component/SideNav";
import { AppHeader } from "@/component/AppHeader";
import { menu } from "@/config/menu";
import { AppProvider } from '@/component/AppContext';
import I18nProvider from '@/component/I18nProvider';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/hook/useI18n';

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { isChineseLanguage } = useI18n();

    const theme = React.useMemo(
        () => createTheme({}, isChineseLanguage() ? zhCN : enUS),
        [isChineseLanguage]
    );

    if (pathname === '/login') {
        return (
            <ThemeProvider theme={theme}>
                <AppProvider>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 0, width: '100%', height: '100vh' }}
                    >
                        {children}
                    </Box>
                </AppProvider>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <AppProvider>
                    <CssBaseline />
                    <AppHeader />
                    <Box>
                        <SideNav items={menu} />
                    </Box>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - 240px)` }, marginTop: '50px' }}
                    >
                        {children}
                    </Box>
                </AppProvider>
            </Box>
        </ThemeProvider>
    );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <I18nProvider>
            <LayoutContent>{children}</LayoutContent>
        </I18nProvider>
    );
};

export default Layout;


