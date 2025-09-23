

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
} from '@mui/material';
import FormView from '@/components/FormView';
import { addNodeSchema } from './schema';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Record<string, any>;
};

export default function AddNodeDialog({ open, onClose, initial }: Props) {
  const [command, setCommand] = useState<string>(initial?.command ?? '');


  const handleSubmit = (values: any) => {
    const cmd = [
      'keadm join',
      `--cloudcore-ipport=${values.cloudcore}`,
      `--kubeedge-version=${values.version}`,
      `--token=${values.token}`,
      `--runtimetype=${values.runtime}`,
    ].join(' ');
    setCommand(cmd);
  };


  const formId = 'addNodeForm';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Node</DialogTitle>

      <DialogContent
        dividers

        sx={{ '& .fv-actions': { display: 'none !important' } }}
      >

        <Box>
          <FormView
            schema={addNodeSchema}
            initialValues={{ ...(initial || {}) }}
            onSubmit={handleSubmit}
            formId={formId}
            {...({ hideActions: true } as any)}
            {...({ showActions: false } as any)}
            {...({ actions: false } as any)}
          />
        </Box>


        <Stack spacing={1} mt={2}>
          <TextField
            label="Command"
            placeholder="Please enter command"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            fullWidth
            multiline
            minRows={6}
          />
        </Stack>
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
