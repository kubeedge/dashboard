'use client';

import React from 'react';
import { addRuleEndpointSchema } from './schema';
import { toRuleEndpoint } from './mapper';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import { useListNamespaces } from '@/api/namespace';
import { useI18n } from '@/hook/useI18n';
import FormDialog from '../FormDialog';

type AddRuleEndpointDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RuleEndpoint) => Promise<void> | void;
  onCreated?: () => void;
};

export default function AddRuleEndpointDialog({ open, onClose, onSubmit, onCreated }: AddRuleEndpointDialogProps) {
  const { data: namespaces } = useListNamespaces();
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.ruleEndpoint')}`}
      formId='add-rule-endpoint-form'
      formSchema={addRuleEndpointSchema(namespaces)}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toRuleEndpoint}
    />
  )
}
