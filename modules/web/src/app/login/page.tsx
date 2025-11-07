'use client'

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Link } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';
import { getVersion } from '@/api/version';
import { useStorage } from '@/hook/useStorage';
import { getServiceAccountName } from '@/helper/token';
import useCookie from '@/hook/useCookie';
import { useAlert } from '@/hook/useAlert';
import { useKeinkRunnable } from '@/api/keink';
import useConfirmDialog from '@/hook/useConfirmDialog';
import KeinkDialog from '@/component/Dialog/KeinkDialog';

const LoginPage = () => {
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [storedToken, setStoredToken] = useStorage('token');
  const [cookie, setCookie] = useCookie('dashboard_user');
  const { error } = useAlert();
  const { data: keinkRes } = useKeinkRunnable();
  const [showKeinkDialog, setShowKeinkDialog] = useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();

  useEffect(() => {
    if (cookie && storedToken) {
      getVersion(storedToken).then(() => {


        window.location.href = '/';
      }).catch(() => {
        setCookie('');
        setStoredToken('');
      });
    }
  }, [cookie, storedToken, setCookie, setStoredToken]);

  const handleLogin = async () => {
    if (!token) {
      setTokenError('Token is required');
      return;
    }
    try {
      const resp = await getVersion(token);

      console.log('resp', resp);

      const user = await getServiceAccountName(token);;
      setStoredToken(token);
      setCookie(user);
      setTokenError('');

      window.location.href = '/';
    } catch (e: any) {
      error(e?.response?.data?.message || e?.message || 'Failed to login');
      setTokenError('Invalid token');
    }
  };

  const handleRunKeink = () => {
    showConfirmDialog({
      title: "Run KubeEdge by Keink",
      content: "Are you sure you want to run KubeEdge installation using Keink? This will start the installation process, and it might take some time to complete.",
      onConfirm: () => {
        setShowKeinkDialog(true);
      },
      onCancel: () => { },
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        position: 'relative', // Add relative positioning for the footer
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '120px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.85)' }}
        >
          KubeEdge
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: 'rgba(0, 0, 0, 0.45)' }}
        >
          Edge Computing Open Platform
        </Typography>
      </Box>

      <TextField
        variant="outlined"
        placeholder="Please enter token"
        InputProps={{
          startAdornment: (
            <PersonIcon sx={{ marginRight: '8px', color: 'gray' }} />
          ),
        }}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        error={!!tokenError}
        helperText={tokenError}
        sx={{
          width: '400px',
          marginBottom: '10px',
          position: 'absolute',
          top: '200px', // Position below the title
        }}
      />

      <Button
        variant="contained"
        onClick={handleLogin}
        sx={{
          backgroundColor: '#3e75c3',
          color: 'white',
          width: '400px',
          position: 'absolute',
          top: '280px', // Position below the input field
          '&:hover': {
            backgroundColor: '#335d9c',
          },
        }}
      >
        Login
      </Button>

      {keinkRes?.ok && (
        <Button
          variant="contained"
          onClick={handleRunKeink}
          sx={{
            backgroundColor: '#3e75c3',
            color: 'white',
            width: '400px',
            position: 'absolute',
            top: '340px', // Position below the input field
            '&:hover': {
              backgroundColor: '#335d9c',
            },
          }}
        >
          Install KubeEdge By Keink
        </Button>
      )}

      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          color: 'rgba(0, 0, 0, 0.45)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          <Link href="https://kubeedge.io/" color="inherit" underline="hover">
            KubeEdge
          </Link>{' '}
          |{' '}
          <Link href="https://github.com/kubeedge/kubeedge" color="inherit" underline="hover">
            <GitHubIcon sx={{ verticalAlign: 'middle' }} />
          </Link>{' '}
          |{' '}
          <Link href="https://github.com/kubeedge/dashboard" color="inherit" underline="hover">
            Dashboard
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: '10px' }}>
          © {new Date().getFullYear()} KubeEdge Community
        </Typography>
      </Box>
      <KeinkDialog
        open={showKeinkDialog}
        onClose={() => setShowKeinkDialog(false)}
      ></KeinkDialog>
      {ConfirmDialogComponent}
    </Box>
  );
};

export default LoginPage;
