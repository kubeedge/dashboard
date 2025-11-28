'use client';

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
  const [fullScreen, setFullScreen] = React.useState(false);
  const yamlText = stringify(props?.content);

  return (
    <Dialog open={!!props?.open} onClose={props?.onClose} fullWidth maxWidth="md" fullScreen={fullScreen}>
      <DialogTitle>YAML</DialogTitle>
      <DialogContent>
        <Box sx={{ height: fullScreen ? 'calc(100vh - 160px)' : '400px', overflowY: 'auto' }}>
          <CodeBlock
            text={yamlText}
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
        <Button onClick={() => setFullScreen(!fullScreen)} variant="outlined">
          {fullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YAMLViewerDialog;
