
'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/components/FormView/FormView';
import { addDeviceSchema } from './schema';
import { toDevice } from './mapper';

import { createDevice } from '@/api/device';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function AddDeviceDialog({ open, onClose, onCreated }: Props) {
  const handleSubmit = async (values: any) => {

    const { ns, body } = toDevice(values);
    await createDevice(ns, body);
    onCreated?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Devices</DialogTitle>
      <DialogContent dividers>
        <FormView
          schema={{ ...addDeviceSchema, submitText: undefined, resetText: undefined }}
          formId="device-form"
          initialValues={{ attributes: [] }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form="device-form">SUBMIT</Button>
      </DialogActions>
    </Dialog>
  );
}
