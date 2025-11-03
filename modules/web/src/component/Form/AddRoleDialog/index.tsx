'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import FormView from '@/component/FormView';
import { addRoleSchema } from './schema';
import { toRole } from './mapper';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddRoleDialog({ open, onClose, onSuccess }: Props) {
  const formId = 'add-role-form';

  const handleSubmit = async (values: any) => {
    const { ns, body } = toRole(values);

    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRoleSchema}
          initialValues={{ rules: [] }}
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
