'use client';

import React from 'react';
import { Role } from '@/types/role';
import { useI18n } from '@/hook/useI18n';
import { addRoleSchema } from './schema';
import { toRole } from './mapper';
import FormDialog from '../FormDialog';

type AddRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Role) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddRoleDialog({ open, onClose, onSubmit, onCreated }: AddRoleDialogProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.role')}`}
      formId='add-role-form'
      formSchema={addRoleSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toRole}
    />
  )
}
