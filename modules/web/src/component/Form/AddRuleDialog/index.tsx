'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { addRuleSchema } from './schema';
import { toRule } from './mapper';
import type { Rule } from '@/types/rule';
import { createRule } from '@/api/rule';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: any, record: Rule) => Promise<void> | void;
};

export default function AddRuleDialog({ open, onClose, onSubmit }: Props) {
  const handleSubmit = async (values: any) => {
    const { ns, body } = toRule(values);

    await createRule(ns, body);

    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Rule</DialogTitle>
      <DialogContent dividers>
        <FormView
          schema={addRuleSchema}
          initialValues={{}}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form="addrule-form">SUBMIT</Button>
      </DialogActions>
    </Dialog>
  );
}
