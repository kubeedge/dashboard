'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/components/FormView';
import { secretSchema } from './schema';
import { toSecret } from './mapper';
import { createSecret } from '@/api/secret';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { Secret } from '@/types/secret';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
  onSubmit: (_: any, record: Secret) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddSecretDialog({
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
      const { body } = toSecret(values);
      await onSubmit(undefined, body as Secret);
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
      <DialogTitle>ADD Secret</DialogTitle>
      <DialogContent dividers>
        <FormView
          schema={secretSchema}
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
