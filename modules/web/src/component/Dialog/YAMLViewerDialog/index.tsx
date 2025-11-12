import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { CodeBlock, dracula } from 'react-code-blocks';
import { stringify } from 'yaml';
import { useI18n } from '@/hook/useI18n';

interface YAMLViewerDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent) => void;
  content?: any;
}

const YAMLViewerDialog = (props?: YAMLViewerDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={!!props?.open} onClose={props?.onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('actions.yaml')}</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', overflowY: 'auto', fontFamily: 'monospace' }}>
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
          {t('actions.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YAMLViewerDialog;
