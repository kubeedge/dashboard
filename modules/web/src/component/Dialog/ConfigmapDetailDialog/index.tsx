
import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material';
import { ConfigMap } from '@/types/configMap';

interface ConfigMapDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: ConfigMap | null;
}

const ConfigMapDetailDialog = ({ open, onClose, data }: ConfigMapDetailDialogProps) => {
  return (
    <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Configmap Detail</DialogTitle>
      <DialogContent>
        <Box sx={{ marginBottom: '16px' }}>
          {/* <Typography variant="h6">ConfigMap Details</Typography> */}
          <Box sx={{ marginTop: '16px' }}>
            <Typography><strong>Namespace:</strong> {data?.metadata?.namespace}</Typography>
            <Typography><strong>Name:</strong> {data?.metadata?.name}</Typography>
            <Typography><strong>Creation Time:</strong> {data?.metadata?.creationTimestamp}</Typography>
          </Box>
        </Box>
        <Box sx={{ marginBottom: '16px' }}>
          <Typography variant="h6">Data</Typography>
          {Object.keys(data?.data || {}).length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data Key</TableCell>
                  <TableCell>Data Value</TableCell>
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
        <Box sx={{ marginBottom: '16px' }}>
          <Typography variant="h6">Labels</Typography>
          {Object.keys(data?.metadata?.labels || {}).length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label Key</TableCell>
                  <TableCell>Label Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(data?.metadata?.labels || {}).map(([key, value]) => (
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} color="primary" variant="contained">Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigMapDetailDialog;
