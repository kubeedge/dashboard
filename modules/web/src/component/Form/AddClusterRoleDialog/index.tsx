'use client';

import React from 'react';
import { ClusterRole } from '@/types/clusterRole';
import { useI18n } from '@/hook/useI18n';
import { addClusterRoleSchema } from './schema';
import { toClusterRole } from './mapper';
import FormDialog from '../FormDialog';

type AddClusterRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ClusterRole) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddClusterRoleDialog({ open, onClose, onSubmit, onCreated }: AddClusterRoleDialogProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.clusterRole')}`}
      formId='add-cluster-role-form'
      formSchema={addClusterRoleSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toClusterRole}
    />
  );
}
