'use client';

import React from 'react';
import { addRoleBindingSchema } from './schema';
import { useI18n } from '@/hook/useI18n';
import { toRoleBinding } from './mapper';
import { RoleBinding } from '@/types/roleBinding';
import FormDialog from '../FormDialog';

type AddRoleBindingProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: RoleBinding) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddRoleBindingDialog({ open, onClose, onSubmit, onCreated }: AddRoleBindingProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.roleBinding')}`}
      formId='add-role-binding-form'
      formSchema={addRoleBindingSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toRoleBinding}
    />
  )
}
