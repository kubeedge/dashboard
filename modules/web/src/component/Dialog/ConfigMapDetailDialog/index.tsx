
import React, { useState } from 'react';
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
import { useI18n } from '@/hook/useI18n';
import YAMLViewerDialog from '../YAMLViewerDialog';
import { formatDateTime } from '@/helper/localization';

interface ConfigMapDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: ConfigMap | null;
}

const ConfigMapDetailDialog = ({ open, onClose, data }: ConfigMapDetailDialogProps) => {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{t('common.configMap')} {t('actions.detail')}</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: '16px' }}>
            <Box sx={{ marginTop: '16px' }}>
              <Typography><strong>{t('table.namespace')}:</strong> {data?.metadata?.namespace}</Typography>
              <Typography><strong>{t('table.name')}:</strong> {data?.metadata?.name}</Typography>
              <Typography><strong>{t('table.creationTime')}:</strong>
                {formatDateTime(data?.metadata?.creationTimestamp, currentLanguage)}
              </Typography>
            </Box>
          </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>{t("actions.cancel")}</Button>
            <Button onClick={() => setYamlDialogOpen(true)} variant="contained">
              {t("actions.yaml")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={data}
      />
    </>
  );
};

export default ConfigMapDetailDialog;
