
'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import FormView from '@/components/FormView';
import { addNodeGroupSchema } from './schema';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;

  onSubmit?: (values: any) => void | Promise<void>;
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

  const handleSubmit = async (values: any) => {

    if (onSubmit) {
      await onSubmit(values);
    }
    onCreated?.();

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Nodegroup</DialogTitle>

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
        <Button onClick={onClose}>CANCEL</Button>
        <Button type="submit" form={formId} variant="contained">
          SUBMIT
        </Button>
      </DialogActions>
    </Dialog>
  );
}
