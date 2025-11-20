
import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Grid,
  TextField
} from '@mui/material';
import { ConfigMap } from '@/types/configMap';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime } from '@/helper/localization';
import DetailDialog from '../DetailDialog';

interface ConfigMapDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: ConfigMap | null;
}

const ConfigMapDetailDialog = ({ open, onClose, data }: ConfigMapDetailDialogProps) => {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  return (
    <DetailDialog
      open={open}
      onClose={onClose}
      data={data}
      title={`${t('common.configMap')} ${t('actions.detail')}`}
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
      <Box sx={{ marginBottom: '16px' }}>
        <Typography variant="h6">{t('table.data')}</Typography>
        {Object.keys(data?.data || {}).length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('table.key')}</TableCell>
                <TableCell>{t('table.value')}</TableCell>
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
        <Typography variant="h6">{t('table.labels')}</Typography>
        {Object.keys(data?.metadata?.labels || {}).length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('table.key')}</TableCell>
                <TableCell>{t('table.value')}</TableCell>
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
    </DetailDialog>
  );
};

export default ConfigMapDetailDialog;
