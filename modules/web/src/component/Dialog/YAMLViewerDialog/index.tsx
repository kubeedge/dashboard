'use client';

// src/component/YAMLViewerDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { CodeBlock, dracula } from 'react-code-blocks';
import { stringify } from 'yaml';
import { copyToClipboard, downloadAsFile } from '@/helper/util';
import { useAlert } from '@/hook/useAlert';

interface YAMLViewerDialogProps {
  open?: boolean;
  onClose?: () => void;
  content?: any;
}

const YAMLViewerDialog = (props?: YAMLViewerDialogProps) => {
  const yamlText = stringify(props?.content);
  const { success } = useAlert();

  const handleCopy = async () => {
    await copyToClipboard(yamlText);
    success('Copied YAML to clipboard');
  };

  const handleDownload = () => {
    const kind = (props?.content?.kind || 'resource').toString().toLowerCase();
    const name = (props?.content?.metadata?.name || 'unnamed').toString().toLowerCase();
    downloadAsFile(`${kind}-${name}.yaml`, yamlText);
    success('Downloaded YAML');
  };

  return (
    <Dialog open={!!props?.open} onClose={props?.onClose} fullWidth maxWidth="md">
      <DialogTitle>YAML</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', overflowY: 'auto' }}>
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
        <Button onClick={handleCopy} color="primary" variant="outlined">
          Copy YAML
        </Button>
        <Button onClick={handleDownload} variant="contained">
          Download YAML
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YAMLViewerDialog;
