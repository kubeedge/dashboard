'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { secretSchema } from './schema';
import { toSecret } from './mapper';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { Secret } from '@/types/secret';
import { useI18n } from '@/hook/useI18n';

type AddSecretDialog = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Secret) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddSecretDialog({
  open,
  onClose,
  onCreated,
  onSubmit,
}: AddSecretDialog) {
  const formId = 'add-secret-form';
  const { t } = useI18n();
  const { error } = useAlert();
  const { namespace } = useNamespace()

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toSecret(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.secret')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={secretSchema}
          initialValues={{ namespace }}
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
