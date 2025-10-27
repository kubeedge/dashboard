'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import FormView from '@/components/FormView';
import { addClusterRoleBindingSchema } from './schema';
import { toClusterRoleBinding } from './mapper';
import { createClusterRoleBinding } from '@/api/clusterRoleBinding';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddClusterRoleBindingDialog({ open, onClose, onSuccess }: Props) {
  const formId = 'add-crb-form';

  const handleSubmit = async (values: any) => {
    const { body } = toClusterRoleBinding(values);
    await createClusterRoleBinding(body);
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add ClusterRoleBinding</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addClusterRoleBindingSchema}
          initialValues={{ subjects: [] }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form={formId}>SUBMIT</Button>
      </DialogActions>
    </Dialog>
  );
}
