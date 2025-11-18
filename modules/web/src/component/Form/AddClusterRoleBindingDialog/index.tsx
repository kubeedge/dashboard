'use client';

import React from 'react';
import { ClusterRoleBinding } from '@/types/clusterRoleBinding';
import { useI18n } from '@/hook/useI18n';
import { addClusterRoleBindingSchema } from './schema';
import { toClusterRoleBinding } from './mapper';
import FormDialog from '../FormDialog';

type AddClusterRoleBindingDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ClusterRoleBinding) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddClusterRoleBindingDialog({ open, onClose, onSubmit, onCreated }: AddClusterRoleBindingDialogProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.clusterRoleBinding')}`}
      formId='add-cluster-role-binding-form'
      formSchema={addClusterRoleBindingSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toClusterRoleBinding}
    />
  );
}
