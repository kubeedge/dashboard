'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView from '@/component/FormView/FormView';
import { addDeviceSchema } from './schema';
import { toDevice } from './mapper';
import { Device } from '@/types/device';
import { useI18n } from '@/hook/useI18n';
import { useAlert } from '@/hook/useAlert';
import { useNamespace } from '@/hook/useNamespace';
import { useListDeviceModels } from '@/api/deviceModel';
import { useListNodes } from '@/api/node';

type AddDeviceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Device) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddDeviceDialog({ open, onClose, onSubmit, onCreated }: AddDeviceDialogProps) {
  const formId = 'add-device-form';
  const { t } = useI18n();
  const { error } = useAlert();
  const { namespace } = useNamespace();
  const { data: deviceModels} = useListDeviceModels(namespace);
  const { data: nodes } = useListNodes();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = toDevice(namespace, values);
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.device')}`}</DialogTitle>
      <DialogContent dividers>
        <FormView
          schema={{ ...addDeviceSchema(deviceModels, nodes), submitText: undefined, resetText: undefined }}
          formId={formId}
          initialValues={{ attributes: [] }}
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
