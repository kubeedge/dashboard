'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView/FormView';
import { addRuleEndpointSchema } from './schema';
import { toRuleEndpoint } from './mapper';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

type AddRuleEndpointDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RuleEndpoint) => Promise<void> | void;
  onCreated?: () => void;
};

export default function AddRuleEndpointDialog({ open, onClose, onSubmit, onCreated }: AddRuleEndpointDialogProps) {
  const formId = 'add-rule-endpoint-form';
  const { data: namespaces } = useListNamespaces();
  const { error } = useAlert();
  const { t } = useI18n();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toRuleEndpoint(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.ruleEndpoint')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRuleEndpointSchema(namespaces)}
          initialValues={{}}
          onSubmit={handleSubmit}
          hideActions
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId}>{t('actions.add')}</Button>
      </DialogActions>
    </Dialog>
  );
}
