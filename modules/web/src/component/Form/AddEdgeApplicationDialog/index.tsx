'use client';

import React, { useState } from 'react';
import { addEdgeAppSchema } from './schema';
import { toEdgeApplication } from './mapper';
import { EdgeApplication } from '@/types/edgeApplication';
import FormDialog from '../FormDialog';
import { useI18n } from '@/hook/useI18n';
import { useNamespace } from '@/hook/useNamespace';
import { useListNamespaces } from '@/api/namespace';
import { useListNodeGroups } from '@/api/nodeGroup';

type AddEdgeApplicationDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (record: EdgeApplication) => Promise<void>;
  onCreated?: () => void;
};

export default function AddEdgeApplicationDialog({ open, onClose, onSubmit, onCreated }: AddEdgeApplicationDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data: namespaces } = useListNamespaces();
  const { data: nodeGroups } = useListNodeGroups();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.edgeApplication')}`}
      formId='add-edge-application-form'
      formSchema={addEdgeAppSchema(namespaces, nodeGroups)}
      defaultValues={{ namespace }}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toEdgeApplication}
    />
  );
}
