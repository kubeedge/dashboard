'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import FormView from '@/component/FormView';
import { addNodeSchema } from './schema';
import { useI18n } from '@/hook/useI18n';

type AddNodeDialogProps = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
};

export default function AddNodeDialog({ open, onClose, initial }: AddNodeDialogProps) {
  const { t } = useI18n();
  const [command, setCommand] = useState<string>(initial?.command ?? '');

  const handleSubmit = (values: any) => {
    const cmd = [
      'keadm join',
      `--cloudcore-ipport=${values.cloudcore}`,
      `--kubeedge-version=${values.version}`,
      `--token=${values.token}`,
    ];
    if (values.runtime === 'docker') {
      cmd.push(`--runtimetype=docker`);
      cmd.push(`--remote-runtime-endpoint=unix:///var/run/dockershim.sock`);
    } else {
      cmd.push(`--runtimetype=remote`);
      cmd.push(`--remote-runtime-endpoint=unix:///run/containerd/containerd.sock`);
    }
    setCommand(cmd.join(' '));
  };

  const formId = 'addNodeForm';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.node')}`}</DialogTitle>
      <DialogContent
        dividers
        sx={{ '& .fv-actions': { display: 'none !important' } }}
      >
        <Box>
          <FormView
            schema={addNodeSchema}
            initialValues={{ ...(initial || {}) }}
            onSubmit={handleSubmit}
            formId={formId}
            {...({ hideActions: true } as any)}
            {...({ showActions: false } as any)}
            {...({ actions: false } as any)}
          />
        </Box>
        <Stack spacing={1} mt={2}>
          <TextField
            label={t('table.command')}
            placeholder={t('table.placeholderCommand')}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            fullWidth
            multiline
            minRows={6}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId} variant="contained">
          {t('actions.generateCommand')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
