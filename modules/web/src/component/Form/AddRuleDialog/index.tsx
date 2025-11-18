'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { addRuleSchema } from './schema';
import { toRule } from './mapper';
import type { Rule } from '@/types/rule';
import { useListNamespaces } from '@/api/namespace';
import { useNamespace } from '@/hook/useNamespace';
import { useI18n } from '@/hook/useI18n';
import { useAlert } from '@/hook/useAlert';

type AddRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Rule) => Promise<void> | void;
  onCreated?: () => void;
};

export default function AddRuleDialog({ open, onClose, onSubmit, onCreated }: AddRuleDialogProps) {
  const formId = 'add-rule-form';
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data: namespaces } = useListNamespaces();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toRule(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.rule')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRuleSchema(namespaces)}
          initialValues={{ namespace }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId}>{t('actions.add')}</Button>
      </DialogActions>
    </Dialog>
  );
}
