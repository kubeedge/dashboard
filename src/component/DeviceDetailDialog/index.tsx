// src/components/DeviceDetailDialog.js
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Device } from '@/types/device';

interface DeviceDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Device | null;
}

function DeviceDetailDialog({ open, onClose, data }: DeviceDetailDialogProps) {
  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Device Detail</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          <Grid item xs={4}>
            <TextField
              label="Name"
              value={data?.metadata?.name}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Protocol"
              value={data?.spec?.protocol?.protocolName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Node"
              value={data?.spec?.nodeName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
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
          <Grid item xs={8}>
            <TextField
              label="Description"
              value={data?.metadata?.annotations?.description}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Table sx={{ marginTop: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>AttributeName</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>AttributeValue</TableCell>
              <TableCell>ReportedValue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {(data?.status?.twins?.length || 0) > 0 ? (
              data?.status?.twins?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.propertyName}</TableCell>
                  <TableCell>{item?.observedDesired?.metadata?.type}</TableCell>
                  <TableCell>{item?.observedDesired?.metadata?.value}</TableCell>
                  <TableCell>{item?.reported?.value}</TableCell>
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
    </Dialog>
  );
}

export default DeviceDetailDialog;
