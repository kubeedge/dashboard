'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { CodeBlock, dracula } from 'react-code-blocks';
import { stringify } from 'yaml';
import { copyToClipboard, downloadAsFile } from '@/helper/util';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface YAMLViewerDialogProps {
  open?: boolean;
  onClose?: () => void;
  content?: any;
}

const YAMLViewerDialog = (props?: YAMLViewerDialogProps) => {
  const { t } = useI18n();
  const { success, error } = useAlert();
  const [fullScreen, setFullScreen] = React.useState(false);

  const yamlText = stringify(props?.content);

  const handleCopy = async () => {
    const isSuccess = await copyToClipboard(yamlText);
    if (isSuccess) {
      success(t('actions.copiedYAML'));
    } else {
      error(t('actions.failedToCopyYAML'));
    }
  };

  const handleDownload = () => {
    const kind = (props?.content?.kind || 'resource').toString().toLowerCase();
    const name = (props?.content?.metadata?.name || 'unnamed').toString().toLowerCase();
    
    const isSuccess = downloadAsFile(`${kind}-${name}.yaml`, yamlText);
    
    if (isSuccess) {
      success(t('actions.downloadedYAML'));
    } else {
      error(t('actions.failedToDownloadYAML'));
    }
  };

  return (
    <Dialog 
      open={!!props?.open} 
      onClose={props?.onClose} 
      fullWidth 
      maxWidth="md" 
      fullScreen={fullScreen}
    >
      <DialogTitle>{t('actions.yaml')}</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          height: fullScreen ? 'calc(100vh - 160px)' : '400px', 
          overflowY: 'auto', 
          fontFamily: 'monospace' 
        }}>
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
          {t('actions.close')}
        </Button>
        <Button onClick={() => setFullScreen(!fullScreen)} variant="outlined">
          {fullScreen ? t('actions.exitFullScreen') : t('actions.fullScreen')}
        </Button>
        <Button onClick={handleCopy} color="primary" variant="outlined">
          {t('actions.copyYAML')}
        </Button>
        <Button onClick={handleDownload} variant="contained">
          {t('actions.downloadYAML')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YAMLViewerDialog;