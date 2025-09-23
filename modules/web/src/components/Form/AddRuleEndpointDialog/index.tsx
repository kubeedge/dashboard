
'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/components/FormView/FormView';
import { addRuleEndpointSchema } from './schema';
import { toRuleEndpoint } from './mapper';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (ns: string, body: any) => Promise<void> | void;
};

export default function AddRuleEndpointDialog({ open, onClose, onSubmit }: Props) {
  const formId = 'ruleendpoint-form';

  const handleSubmit = async (values: any) => {
    const { ns, body } = toRuleEndpoint(values);
    await onSubmit(ns, body);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add RuleEndpoint</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRuleEndpointSchema}
          initialValues={{}}
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
