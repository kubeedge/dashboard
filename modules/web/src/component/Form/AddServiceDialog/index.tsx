'use client';

import React from 'react';
import { addServiceSchema } from './schema';
import { toService } from './mapper';
import { Service } from '@/types/service';
import FormDialog from '../FormDialog';
import { useNamespace } from '@/hook/useNamespace';
import { useI18n } from '@/hook/useI18n';
import { useListNamespaces } from '@/api/namespace';

type AddServiceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (record: Service) => void;
  onCreated?: () => void;
};

export default function AddServiceDialog({ open, onClose, onSubmit, onCreated }: AddServiceDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data: namespaces } = useListNamespaces();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.service')}`}
      formId='add-service-form'
      formSchema={addServiceSchema(namespaces)}
      open={open}
      defaultValues={{ namespace }}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toService}
    />
  )
}
