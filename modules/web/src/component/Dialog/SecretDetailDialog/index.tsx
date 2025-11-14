// src/component/SecretDetailDialog.js
import React, { useState } from 'react';
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
  DialogActions,
  Button,
} from '@mui/material';
import { Secret } from '@/types/secret';
import { useI18n } from '@/hook/useI18n';
import { YAMLViewerDialog } from '@/component';
import { formatDateTime } from '@/helper/localization';

interface SecretDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Secret | null;
}

const SecretDetailDialog = ({ open, onClose, data }: SecretDetailDialogProps) => {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);

  const renderDockerInformation = (secretData?: Record<string, any>) => {
    const dockerConfigJSON = secretData?.['.dockerconfigjson'] ? atob(secretData?.['.dockerconfigjson']) : '{}';
    const dockerData = JSON.parse(dockerConfigJSON);
    const auths = dockerData?.auths || {};
    const server = Object.keys(auths)?.[0];
    const username = auths?.[server]?.username;
    const password = auths?.[server]?.password;

    return (
      <Box sx={{ marginBottom: '16px' }}>
        <Typography variant="h6">{t('table.dockerInformation')}</Typography>
        <Box sx={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label={t('table.dockerServer')} value={server} InputProps={{ readOnly: true }} />
          <TextField label={t('table.dockerUsername')} value={username} InputProps={{ readOnly: true }} />
          <TextField label={t('table.dockerPassword')} value={password} InputProps={{ readOnly: true }} />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{`${t('common.secret')} ${t('actions.detail')}`}</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="h6">{t('table.generalInformation')}</Typography>
            <Box sx={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField label={t('table.namespace')} value={data?.metadata?.namespace} InputProps={{ readOnly: true }} />
              <TextField label={t('table.name')} value={data?.metadata?.name} InputProps={{ readOnly: true }} />
              <TextField
                label={t('table.creationTime')}
                value={formatDateTime(data?.metadata?.creationTimestamp, currentLanguage)}
                InputProps={{ readOnly: true }}
              />
              <TextField label={t('table.type')} value={data?.type} InputProps={{ readOnly: true }} />
            </Box>
          </Box>

          {data?.type === 'kubernetes.io/dockerconfigjson' && renderDockerInformation(data?.data)}

          {data?.type === 'Opaque' && (
            <Box>
              <Typography variant="h6">{t('table.data')}</Typography>
              {Object.keys(data).length > 0 ? (
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
                        <TableCell sx={{ whiteSpace: 'normal', lineBreak: 'anywhere' }}>{value}</TableCell>
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
};

export default SecretDetailDialog;
