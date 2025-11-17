import React, { useState } from 'react';
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
} from '@mui/material';
import { DeviceModel } from '@/types/deviceModel';
import YAMLViewerDialog from '../YAMLViewerDialog';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime } from '@/helper/localization';

interface DeviceModelDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: DeviceModel | null;
}

function DeviceModelDetailDialog({ open, onClose, data }: DeviceModelDetailDialogProps) {
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <Dialog open={!!open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>{t('common.deviceModel')} {t('actions.detail')}</DialogTitle>
        <DialogContent dividers>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("actions.cancel")}</Button>
          <Button onClick={() => setYamlDialogOpen(true)} variant="contained">
            {t("actions.yaml")}
          </Button>
        </DialogActions>
      </Dialog>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={data} // Pass YAML content
      />
    </>
  );
}

export default DeviceModelDetailDialog;
