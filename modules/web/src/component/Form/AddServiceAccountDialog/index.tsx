'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import FormView from '@/component/FormView';
import { addSaSchema } from './schema';
import { toServiceAccount } from './mapper';
import { createServiceAccount } from '@/api/serviceAccount';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddServiceAccountDialog({ open, onClose, onSuccess }: Props) {
  const formId = 'add-sa-form';

  const handleSubmit = async (values: any) => {
    const { ns, body } = toServiceAccount(values);
    await createServiceAccount(ns, body);
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add ServiceAccounts</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addSaSchema}
          initialValues={{}}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form={formId}>ADD</Button>
      </DialogActions>
    </Dialog>
  );
}
