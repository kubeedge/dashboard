// src/component/YAMLViewerDialog.js

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { CodeBlock, dracula } from 'react-code-blocks';
import { stringify } from 'yaml';

interface YAMLViewerDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent) => void;
  content?: any;
}

const YAMLViewerDialog = (props?: YAMLViewerDialogProps) => {
  return (
    <Dialog open={!!props?.open} onClose={props?.onClose} fullWidth maxWidth="md">
      <DialogTitle>YAML</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', overflowY: 'auto' }}>
          <CodeBlock
            text={stringify(props?.content)}
            language="yaml"
            showLineNumbers
            theme={dracula}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props?.onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YAMLViewerDialog;
