'use client';

import { secretSchema } from './schema';
import { toSecret } from './mapper';
import { useNamespace } from '@/hook/useNamespace';
import { Secret } from '@/types/secret';
import { useI18n } from '@/hook/useI18n';
import FormDialog from '../FormDialog';

type AddSecretDialogProps = {
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
}: AddSecretDialogProps) {
  const { t } = useI18n();
  const { namespace } = useNamespace();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.secret')}`}
      formId="add-secret-form"
      formSchema={secretSchema}
      open={open}
      defaultValues={{ namespace }}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toSecret}
    />
  );
}
