'use client';

import React, { useState } from 'react';
import { useI18n } from '@/hook/useI18n';
import { addSaSchema } from './schema';
import { toServiceAccount } from './mapper';
import { ServiceAccount } from '@/types/serviceAccount';
import FormDialog from '../FormDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useListNamespaces } from '@/api/namespace';
import { ConciseSecretList } from '@/types/secret';
import { listSecrets, useListSecrets } from '@/api/secret';

type AddServiceAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ServiceAccount) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddServiceAccountDialog({ open, onClose, onSubmit, onCreated }: AddServiceAccountDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const [ currentNamespace, setCurrentNamespace ] = useState(namespace);
  const { data: namespaces } = useListNamespaces();
  const { data: secrets } = useListSecrets(currentNamespace);

  const handleValueChange = (values: any) => {
    if (values?.namespace === currentNamespace) {
      return;
    }
    setCurrentNamespace(values?.namespace);
  }

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.serviceAccount')}`}
      formId='add-service-account-form'
      formSchema={addSaSchema(namespaces, secrets)}
      open={open}
      defaultValues={{ namespace }}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toServiceAccount}
      onChange={handleValueChange}
    />
  )
}
