'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import FormView from '@/component/FormView';
import { addNodeGroupSchema } from './schema';
import { toNodeGroup } from './mapper';
import { NodeGroup } from '@/types/nodeGroup';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
  onSubmit?: (values: NodeGroup) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddNodeGroupDialog({
  open,
  onClose,
  initial,
  onSubmit,
  onCreated,
}: Props) {
  const formId = 'addNodeGroupForm';
  const { error } = useAlert();
  const { t } = useI18n();

  const handleSubmit = async (values: any) => {
    try {
      if (onSubmit) {
        await onSubmit(toNodeGroup(values));
      }
      onCreated?.();
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{`${t('actions.add')} ${t('common.nodeGroup')}`}</DialogTitle>
      <DialogContent
        dividers
        sx={{ '& .fv-actions': { display: 'none !important' } }}
      >
        <Box>
          <FormView
            schema={addNodeGroupSchema}
            initialValues={{ ...(initial || {}) }}
            onSubmit={handleSubmit}
            formId={formId}
            {...({ hideActions: true } as any)}
            {...({ showActions: false } as any)}
            {...({ actions: false } as any)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('actions.cancel')}</Button>
        <Button type="submit" form={formId} variant="contained">
          {t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
