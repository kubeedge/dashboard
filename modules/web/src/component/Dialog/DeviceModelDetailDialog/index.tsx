import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Box,
  Pagination,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { DeviceModel } from '@/types/deviceModel';

interface DeviceModelDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: DeviceModel | null;
}

function DeviceModelDetailDialog({ open, onClose, data }: DeviceModelDetailDialogProps) {
  const handleAddDeviceTwinClick = () => {

  };

  const handleRefreshClick = () => {

  };

  const handleCancelClick = () => {
    onClose?.();
  };

  const handleOkClick = () => {
    onClose?.();
  };

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>DeviceModel Detail</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              value={data?.metadata?.name || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Namespace"
              value={data?.metadata?.namespace || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Creation Time"
              value={data?.metadata?.creationTimestamp || ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>AttributeName</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>AttributeValue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data?.spec?.properties?.length || 0) > 0 ? (
              data?.spec?.properties?.map((twin, index) => (
                <TableRow key={index}>
                  <TableCell>{twin.name}</TableCell>
                  <TableCell>{twin.description}</TableCell>
                  <TableCell>{typeof twin.type === 'string' ? twin.type : ''}</TableCell>
                  <TableCell>{twin.unit}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button onClick={handleOkClick} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeviceModelDetailDialog;
