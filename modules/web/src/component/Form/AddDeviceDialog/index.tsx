'use client';
import React from 'react';
import { addDeviceSchema } from './schema';
import { toDevice } from './mapper';
import { Device } from '@/types/device';
import { useI18n } from '@/hook/useI18n';
import { useNamespace } from '@/hook/useNamespace';
import { useListDeviceModels } from '@/api/deviceModel';
import { useListNodes } from '@/api/node';
import FormDialog from '../FormDialog';

type AddDeviceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: Device) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddDeviceDialog({ open, onClose, onSubmit, onCreated }: AddDeviceDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data: deviceModels } = useListDeviceModels(namespace);
  const { data: nodes } = useListNodes();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.device')}`}
      formId='add-device-form'
      formSchema={addDeviceSchema(deviceModels, nodes)}
      defaultValues={{ namespace }}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={(values: any) => toDevice(namespace, values)}
    />
  )
}
