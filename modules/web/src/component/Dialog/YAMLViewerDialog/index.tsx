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
  // 1. 合并 Hook：同时获取国际化 t 函数和弹窗 success 函数
  const { t } = useI18n();
  const { success } = useAlert();

  // 2. 合并逻辑：保留 feat 分支中关于 yaml 转换和下载的逻辑
  const yamlText = stringify(props?.content);

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
      <DialogTitle>{t('actions.yaml')}</DialogTitle>
      <DialogContent>
        <Box sx={{ height: '400px', overflowY: 'auto', fontFamily: 'monospace' }}>
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
          {t('actions.cancel')}
        </Button>
        {/* 保留新功能的按钮 */}
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