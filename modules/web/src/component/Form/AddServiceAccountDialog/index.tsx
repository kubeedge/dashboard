'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { useI18n } from '@/hook/useI18n';
import { addSaSchema } from './schema';
import { toServiceAccount } from './mapper';
import { ServiceAccount } from '@/types/serviceAccount';
import { useAlert } from '@/hook/useAlert';

type AddServiceAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ServiceAccount) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddServiceAccountDialog({ open, onClose, onSubmit, onCreated }: AddServiceAccountDialogProps) {
  const formId = 'add-sa-form';
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      const body = toServiceAccount(values);
      if (onSubmit) {
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.serviceAccount')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addSaSchema}
          initialValues={{}}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId}>{t('actions.add')}</Button>
      </DialogActions>
    </Dialog>
  );
}
