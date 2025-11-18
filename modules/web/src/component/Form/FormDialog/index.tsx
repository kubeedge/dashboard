'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import FormView, { FormSchema } from '@/component/FormView';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

type FormDialogProps<T> = {
  title?: string;
  formId: string;
  formSchema: FormSchema;
  open: boolean;
  defaultValues?: any;
  onClose: () => void;
  onSubmit?: (record: T) => void | Promise<void>;
  onCreated?: () => void;
  transform?: (values: any) => T;
};

export default function FormDialog<T>({
  title,
  formId,
  formSchema,
  open,
  defaultValues,
  onClose,
  onCreated,
  onSubmit,
  transform
}: FormDialogProps<T>) {
  const { t } = useI18n();
  const { error } = useAlert();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        const body = transform ? transform(values) : values;
        await onSubmit(body);
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <FormView
          formId={formId}
          schema={formSchema}
          initialValues={{ ...defaultValues }}
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
