'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/components/FormView';
import { deviceModelSchema } from './schema';
import { toDeviceModel } from './mapper';
import { createDeviceModel } from '@/api/deviceModel';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddDeviceModelDialog({ open, onClose, initial, onCreated }: Props) {
  const { success, error } = useAlert();
  const { namespace: currentNs } = useNamespace?.() || { namespace: '' };

  const handleSubmit = async (values: any) => {
    try {
      const { ns, body } = toDeviceModel(values);
      await createDeviceModel(ns, body);
      success('success');
      onCreated?.();
      onClose();
    } catch (e: any) {
      console.error(e);
      error(e?.message || 'error');
    }
  };

  const initValues = { namespace: currentNs || '', ...initial };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add devicemodels</DialogTitle>
      <DialogContent dividers>
        <FormView schema={deviceModelSchema} initialValues={initValues} onSubmit={handleSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
