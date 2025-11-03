'use client'

import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import { useListNamespaces } from '@/api/namespace';
import { useNamespace } from '@/hook/useNamespace';
import { useStorage } from '@/hook/useStorage';
import useCookie from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import LanguageSwitcher from '@/component/LanguageSwitcher';
import { useI18n } from '@/hook/useI18n';

const CustomSelect = styled(Select)(({ theme }) => ({
  height: 32,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    color: 'white', // Font color
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-icon': {
    color: 'white', // Arrow color
  },
  '&:before': {
    borderColor: 'white', // Optional: color for the underline before focus
  },
}));

export const AppHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { data } = useListNamespaces();
  const { namespace, setNamespace } = useNamespace();
  const [_, setStoredToken] = useStorage('token');
  const [cookie, setCookie] = useCookie('dashboard_user');
  const { t } = useI18n();

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setStoredToken('');
    setCookie('');
    window.location.href = '/login';
  }

  const handleNamespaceClose = (event: any) => {
    setNamespace(event.target.value);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: 50 }}>
      <Toolbar
        sx={{
          minHeight: 50,
          display: 'flex',
          alignItems: 'center',
          '@media (min-width: 600px)': {
            minHeight: 50,
          },
        }}
      >
        {/* Left side: KubeEdge Icon and Dashboard Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Image src="/icons/favicon.png" alt="KubeEdge" width={32} height={32} style={{ marginRight: 8 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: 18 }}>
            KubeEdge {t('common.dashboard')}
          </Typography>
        </Box>

        {/* Center: Namespace Dropdown and Language Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginRight: 2 }}>
          <CustomSelect
            value={namespace || ''}
            onChange={handleNamespaceClose}
            displayEmpty
          >
            <MenuItem key={'all-namespace'} value={''}>{t('table.namespace')}</MenuItem>
            {data?.items?.map((namespace) => {
              const name = namespace.metadata?.name;
              return (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              );
            })}
          </CustomSelect>

          <Box sx={{ '& .MuiSelect-select': { color: 'white' }, '& .MuiSelect-icon': { color: 'white' } }}>
            <LanguageSwitcher variant="standard" showIcon={false} />
          </Box>
        </Box>

        {/* Right side: Username */}
        <Box>
          <IconButton onClick={handleMenu} color="inherit">
            <Typography variant="body1" color="inherit">{cookie || 'admin'}</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>{t('common.logout')}</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
