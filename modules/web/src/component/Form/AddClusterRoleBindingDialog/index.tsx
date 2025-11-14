'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { ClusterRoleBinding } from '@/types/clusterRoleBinding';
import { useI18n } from '@/hook/useI18n';
import { useAlert } from '@/hook/useAlert';
import { addClusterRoleBindingSchema } from './schema';
import { toClusterRoleBinding } from './mapper';

type AddClusterRoleBindingDialogProps = {
open: boolean;
  onClose: () => void;
  onSubmit: (record: ClusterRoleBinding) => void | Promise<void>;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddClusterRoleBindingDialog({ open, onClose, onSubmit, onCreated }: AddClusterRoleBindingDialogProps) {
  const formId = 'add-crb-form';
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
      try {
        if (onSubmit) {
          const body = toClusterRoleBinding(values);
          await onSubmit(body);
        }
        onCreated?.();
      } catch (err: any) {
        error(err?.response?.data?.message || err?.message || t('messages.error'));
      }
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.clusterRoleBinding')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addClusterRoleBindingSchema}
          initialValues={{ subjects: [] }}
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
