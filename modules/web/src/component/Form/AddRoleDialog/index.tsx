'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { Role } from '@/types/role';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { addRoleSchema } from './schema';
import { toRole } from './mapper';

type AddRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Role) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddRoleDialog({ open, onClose, onSubmit, onCreated }: AddRoleDialogProps) {
  const formId = 'add-role-form';
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toRole(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.role')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addRoleSchema}
          initialValues={{ rules: [] }}
          onSubmit={handleSubmit}
          hideActions
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId}>{t('actions.add')}</Button>
      </DialogActions>
    </Dialog>
  );
}
