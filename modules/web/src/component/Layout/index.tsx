'use client'

import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import SideNav from "@/component/SideNav";
import { AppHeader } from "@/component/AppHeader";
import { menu } from "@/config/menu";
import { AppProvider } from '@/component/AppContext';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  if (pathname === '/login') {
    return (
      <AppProvider>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0, width: '100%', height: '100vh' }}
        >
          {children}
        </Box>
      </AppProvider>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppProvider>
        <CssBaseline />
        <AppHeader />
        <Box>
          <SideNav items={menu} />
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - 240px)` },marginTop: '50px' }}
        >
          {children}
        </Box>
      </AppProvider>
    </Box>
  )
}

export default Layout;
