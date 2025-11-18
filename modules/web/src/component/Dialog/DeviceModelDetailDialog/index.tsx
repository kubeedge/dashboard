import React from 'react';
import {
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { DeviceModel } from '@/types/deviceModel';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime } from '@/helper/localization';
import { DetailDialog } from '@/component/Dialog';

interface DeviceModelDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: DeviceModel | null;
}

function DeviceModelDetailDialog({ open, onClose, data }: DeviceModelDetailDialogProps) {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  return (
    <DetailDialog
      open={open}
      onClose={onClose}
      data={data}
      title={`${t('common.deviceModel')} ${t('actions.detail')}`}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label={t('table.name')}
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
            label={t('table.namespace')}
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
            label={t('table.creationTime')}
            value={formatDateTime(data?.metadata?.creationTimestamp, currentLanguage)}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Table sx={{ marginTop: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.attributeName')}</TableCell>
            <TableCell>{t('table.description')}</TableCell>
            <TableCell>{t('table.type')}</TableCell>
            <TableCell>{t('table.attributeValue')}</TableCell>
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
    </DetailDialog>
  )
}

export default DeviceModelDetailDialog;
