'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormView from '@/component/FormView';
import { ClusterRole } from '@/types/clusterRole';
import { useI18n } from '@/hook/useI18n';
import { useAlert } from '@/hook/useAlert';
import { addClusterRoleSchema } from './schema';
import { toClusterRole } from './mapper';

type AddClusterRoleDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ClusterRole) => void | Promise<void>;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddClusterRoleDialog({ open, onClose, onSubmit, onCreated }: AddClusterRoleDialogProps) {
  const formId = 'add-cluster-role-form';
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toClusterRole(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.clusterRole')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={addClusterRoleSchema}
          initialValues={{ rules: [], matchLabels: [] }}
          hideActions
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
