'use client';

import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'white' }}>
        <Typography>admin</Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
