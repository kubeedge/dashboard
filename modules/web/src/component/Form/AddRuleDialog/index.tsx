'use client';

import React, { useState } from 'react';
import { addRuleSchema } from './schema';
import { toRule } from './mapper';
import type { Rule } from '@/types/rule';
import { useListNamespaces } from '@/api/namespace';
import { useNamespace } from '@/hook/useNamespace';
import { useI18n } from '@/hook/useI18n';
import FormDialog from '../FormDialog';
import { useListRuleEndpoints } from '@/api/ruleEndpoint';

type AddRuleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Rule) => Promise<void> | void;
  onCreated?: () => void;
};

export default function AddRuleDialog({ open, onClose, onSubmit, onCreated }: AddRuleDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const [ currentNamespace, setCurrentNamespace ] = useState(namespace);
  const { data: namespaces } = useListNamespaces();
  const { data: ruleEndpoints } = useListRuleEndpoints(currentNamespace);

  const handleValueChange = (values: any) => {
    if (values?.namespace === currentNamespace) {
      return;
    }
    setCurrentNamespace(values?.namespace);
  }

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.rule')}`}
      formId='add-rule-form'
      formSchema={addRuleSchema(namespaces, ruleEndpoints)}
      defaultValues={{ namespace }}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toRule}
      onChange={handleValueChange}
    />
  )
}
