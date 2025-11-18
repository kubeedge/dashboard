'use client';

import { addNodeGroupSchema } from './schema';
import { toNodeGroup } from './mapper';
import { NodeGroup } from '@/types/nodeGroup';
import { useI18n } from '@/hook/useI18n';
import FormDialog from '../FormDialog';

type AddNodeGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: NodeGroup) => void | Promise<void>;
  onCreated?: () => void;
};

export default function AddNodeGroupDialog({ open, onClose, onSubmit, onCreated }: AddNodeGroupDialogProps) {
  const { t } = useI18n();

  return (
    <FormDialog
      title={`${t('actions.add')} ${t('common.nodeGroup')}`}
      formId='add-node-group-form'
      formSchema={addNodeGroupSchema}
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      onCreated={onCreated}
      transform={toNodeGroup}
    />
  )
}
