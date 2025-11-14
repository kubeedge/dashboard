'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { addRoleBindingSchema } from './schema';
import { useI18n } from '@/hook/useI18n';
import { useAlert } from '@/hook/useAlert';
import { toRoleBinding } from './mapper';
import { RoleBinding } from '@/types/roleBinding';

type AddRoleBindingProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: RoleBinding) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddRoleBindingDialog({ open, onClose, onSubmit, onCreated }: AddRoleBindingProps) {
  const formId = 'add-role-binding-form';
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toRoleBinding(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.roleBinding')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRoleBindingSchema}
          initialValues={{ subjects: [] }}
          onSubmit={handleSubmit}
          hideActions
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId}>{t('actions.submit')}</Button>
      </DialogActions>
    </Dialog>
  );
}
