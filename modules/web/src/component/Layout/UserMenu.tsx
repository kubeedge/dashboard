'use client';

import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { useI18n } from '@/hook/useI18n';
import useCookie from '@/hook/useCookie';
import { useStorage } from '@/hook/useStorage';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cookie, setCookie] = useCookie('dashboard_user');
  const { t } = useI18n();
  const [_, setStoredToken] = useStorage('token');

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setStoredToken('');
    setCookie('');
    window.location.href = '/login';
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
        <Typography>{cookie || 'admin'}</Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>{t('common.logout')}</MenuItem>
      </Menu>
    </>
  );
}
