'use client';

import React from 'react';
import { addRuleSchema } from './schema';
import { toRule } from './mapper';
import type { Rule } from '@/types/rule';
import { useListNamespaces } from '@/api/namespace';
import { useNamespace } from '@/hook/useNamespace';
import { useI18n } from '@/hook/useI18n';
import FormDialog from '../FormDialog';

type AddRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Rule) => Promise<void> | void;
  onCreated?: () => void;
};

export default function AddRuleDialog({ open, onClose, onSubmit, onCreated }: AddRuleDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data: namespaces } = useListNamespaces();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.rule')}`}
      formId='add-rule-form'
      formSchema={addRuleSchema(namespaces)}
      defaultValues={{ namespace }}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toRule}
    />
  )
}
