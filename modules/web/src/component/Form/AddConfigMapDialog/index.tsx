'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { ConfigMap } from '@/types/configMap';
import { useI18n } from '@/hook/useI18n';
import { toConfigMap } from './mapper';
import { configMapSchema } from './schema';

type AddConfigMapDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ConfigMap) => void | Promise<void>;
  initial?: Record<string, any>;
  onCreated?: () => void;
};

export default function AddConfigMapDialog({
  open,
  onClose,
  initial,
  onCreated,
  onSubmit,
}: AddConfigMapDialogProps) {
  const formId = 'add-configmap-form';
  const { t } = useI18n();
  const { error } = useAlert();
  const { namespace: currentNs } = (useNamespace?.() as any) || { namespace: '' };

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toConfigMap(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const initValues = { namespace: currentNs || '', ...(initial || {}) };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.configMap')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={configMapSchema}
          initialValues={initValues}
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
