'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { addEdgeAppSchema } from './schema';
import { toEdgeApplication } from './mapper';
import { createEdgeApplication } from '@/api/edgeApplication';
import { useAlert } from '@/hook/useAlert';
import React, { useMemo } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddEdgeApplicationDialog({ open, onClose, initial, onCreated }: Props) {
  const { success, error } = useAlert();

  const schemaNoActions = useMemo(
    () => ({ ...addEdgeAppSchema, submitText: undefined, resetText: undefined }),
    []
  );

  const handleSubmit = async (values: any) => {
    try {
      const { ns, body } = toEdgeApplication(values);
      await createEdgeApplication(ns, body);
      success('Created');
      onCreated?.();
      onClose();
    } catch (e: any) {
      console.error(e);
      error(e?.response?.data?.message || e?.message || 'Create failed');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add EdgeApplication</DialogTitle>
      <DialogContent dividers>
        <FormView
        schema={schemaNoActions}
        formId="edgeapp-form"
        initialValues={{
          workloadTemplate: [],
          targetNodeGroups: [],
        }}
        onSubmit={handleSubmit}
      />
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose}>CANCEL</Button>
      <Button type="submit" form="edgeapp-form">SUBMIT</Button>
    </DialogActions>

    </Dialog>
  );
}
