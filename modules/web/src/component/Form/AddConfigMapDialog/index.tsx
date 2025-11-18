'use client';

import { useNamespace } from '@/hook/useNamespace';
import { ConfigMap } from '@/types/configMap';
import { useI18n } from '@/hook/useI18n';
import { toConfigMap } from './mapper';
import { configMapSchema } from './schema';
import FormDialog from '../FormDialog';

type AddConfigMapDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (record: ConfigMap) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddConfigMapDialog({ open, onClose, onCreated, onSubmit }: AddConfigMapDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace()

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.configMap')}`}
      formId="add-config-map-form"
      formSchema={configMapSchema}
      open={open}
      defaultValues={{ namespace }}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toConfigMap}
    />
  );
}
