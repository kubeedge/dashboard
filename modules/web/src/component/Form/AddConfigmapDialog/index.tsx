'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { configmapSchema } from './schema';
import { toConfigMap } from './mapper';
import { createConfigMap } from '@/api/configMap';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { ConfigMap } from '@/types/configMap';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (_: any, record: ConfigMap) => void | Promise<void>;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddConfigmapDialog({
  open,
  onClose,
  initial,
  onCreated,
  onSubmit,
}: Props) {
  const { success, error } = useAlert();
  const { namespace: currentNs } = (useNamespace?.() as any) || { namespace: '' };

  const handleSubmit = async (values: any) => {
    try {
      const { body } = toConfigMap(values);
      await onSubmit(undefined, body as ConfigMap);
      success?.('success');
      onCreated?.();
      onClose();
    } catch (e: any) {
      console.error(e);
      error?.(e?.message || 'error');
    }
  };

const initValues = { namespace: currentNs || '', ...(initial || {}) };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ADD ConfigMap</DialogTitle>
      <DialogContent dividers>
        <FormView
          schema={configmapSchema}
          initialValues={initValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

      </DialogActions>
    </Dialog>
  );
}
