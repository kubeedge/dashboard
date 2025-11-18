'use client';

import React from 'react';
import { useI18n } from '@/hook/useI18n';
import { addSaSchema } from './schema';
import { toServiceAccount } from './mapper';
import { ServiceAccount } from '@/types/serviceAccount';
import FormDialog from '../FormDialog';

type AddServiceAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ServiceAccount) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddServiceAccountDialog({ open, onClose, onSubmit, onCreated }: AddServiceAccountDialogProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.serviceAccount')}`}
      formId='add-service-account-form'
      formSchema={addSaSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toServiceAccount}
    />
  )
}
