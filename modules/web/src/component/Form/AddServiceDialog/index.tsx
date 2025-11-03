'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import FormView from '@/component/FormView';
import { addServiceSchema } from './schema';
import { toService } from './mapper';
import { createService } from '@/api/service';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function AddServiceDialog({ open, onClose, onSubmit }: Props) {
  const formId = 'add-service-form';

  const handleSubmit = async (values: any) => {
    const { ns, body } = toService(values);
    await createService(ns, body);
    onSubmit?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Service</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addServiceSchema}
          hideActions
          initialValues={{
            serviceType: 'ClusterIP',
            ports: [],
            annotations: [],
            labels: [],
            selectors: [],
            externalIPs: [],
            publishNotReadyAddresses: false,
            sessionAffinity: 'None',
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button form={formId} type="submit" variant="contained">
          ADD
        </Button>
      </DialogActions>
    </Dialog>
  );
}
