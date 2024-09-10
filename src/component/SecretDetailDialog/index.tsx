// src/component/SecretDetailDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from '@mui/material';
import { Secret } from '@/types/secret';

interface SecretDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Secret | null;
}

const SecretDetailDialog = ({ open, onClose, data }: SecretDetailDialogProps) => {
  const renderDockerInformation = (secretData?: Record<string, any>) => {
    const dockerData = JSON.parse(atob(secretData?.['.dockerconfigjson']))
    const server = Object.keys(dockerData)[0];
    const username = dockerData?.[server]?.username;
    const password = dockerData?.[server]?.password;

    return (
      <Box sx={{ marginBottom: '16px' }}>
        <Typography variant="h6">Docker Information</Typography>
        <Box sx={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label="Docker server" value={server} InputProps={{ readOnly: true }} />
          <TextField label="Docker username" value={username} InputProps={{ readOnly: true }} />
          <TextField label="Docker password" value={password} InputProps={{ readOnly: true }} />
        </Box>
      </Box>
    );
  }

  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Secret Detail</DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '16px' }}>
          <Typography variant="h6">General Information</Typography>
          <Box sx={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField label="Namespace" value={data?.metadata?.namespace} InputProps={{ readOnly: true }} />
            <TextField label="Name" value={data?.metadata?.name} InputProps={{ readOnly: true }} />
            <TextField label="Creation Time" value={data?.metadata?.creationTimestamp} InputProps={{ readOnly: true }} />
            <TextField label="Type" value={data?.type} InputProps={{ readOnly: true }} />
          </Box>
        </Box>

        {data?.type === 'kubernetes.io/dockerconfigjson' && renderDockerInformation(data?.data)}

        {data?.type === 'Opaque' && (
          <Box>
            <Typography variant="h6">Data</Typography>
            {Object.keys(data).length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(data?.data || {}).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>No data</Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SecretDetailDialog;
