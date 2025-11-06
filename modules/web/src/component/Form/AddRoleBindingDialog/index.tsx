'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { addRoleBindingSchema } from './schema';

type Props = { open: boolean; onClose: () => void; onSuccess?: () => void };

export default function AddRoleBindingDialog({ open, onClose, onSuccess }: Props) {
  const formId = 'add-rolebinding-form';

  const handleSubmit = async (values: any) => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add RoleBinding</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRoleBindingSchema}
          initialValues={{ subjects: [] }}
          onSubmit={handleSubmit}
          hideActions
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form={formId}>SUBMIT</Button>
      </DialogActions>
    </Dialog>
  );
}
