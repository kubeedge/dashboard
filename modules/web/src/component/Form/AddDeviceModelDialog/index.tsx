'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView';
import { deviceModelSchema } from './schema';
import { toDeviceModel } from './mapper';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { DeviceModel } from '@/types/deviceModel';
import { useI18n } from '@/hook/useI18n';
import { useListNamespaces } from '@/api/namespace';

type AddDeviceModelDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: DeviceModel) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddDeviceModelDialog({ open, onClose, onCreated, onSubmit }: AddDeviceModelDialogProps) {
  const formId = 'add-device-model-form';
  const { t } = useI18n();
  const { error } = useAlert();
  const { namespace } = useNamespace();
  const { data } = useListNamespaces();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toDeviceModel(values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.deviceModel')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={deviceModelSchema(data)}
          initialValues={{ namespace }}
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
