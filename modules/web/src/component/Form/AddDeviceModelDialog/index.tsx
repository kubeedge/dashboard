'use client';

import { deviceModelSchema } from './schema';
import { toDeviceModel } from './mapper';
import { useNamespace } from '@/hook/useNamespace';
import { DeviceModel } from '@/types/deviceModel';
import { useI18n } from '@/hook/useI18n';
import { useListNamespaces } from '@/api/namespace';
import FormDialog from '../FormDialog';

type AddDeviceModelDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: DeviceModel) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddDeviceModelDialog({ open, onClose, onCreated, onSubmit }: AddDeviceModelDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();
  const { data } = useListNamespaces();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.deviceModel')}`}
      formId='add-device-model-form'
      formSchema={deviceModelSchema(data)}
      defaultValues={{ namespace }}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toDeviceModel}
    />
  )
}
