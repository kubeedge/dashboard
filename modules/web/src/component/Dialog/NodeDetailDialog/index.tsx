import React, { useState } from 'react';
import { Box, Typography, Button, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Node } from '@/types/node';
import { getNodeStatus } from '@/helper/status';
import { convertKiToGTM } from '@/helper/util';
import { useI18n } from '@/hook/useI18n';
import { formatStatus, formatDateTime } from '@/helper/localization';
import DetailDialog from '../DetailDialog';
import YAMLViewerDialog from '../YAMLViewerDialog';
import { useAlert } from '@/hook/useAlert';
import { copyToClipboard } from '@/helper/util';

interface NodeDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Node;
}

export function NodeDetailDialog({ open, onClose, data }: NodeDetailDialogProps) {
  const theme = useTheme();
  
  // 1. 合并 Hooks
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const { success } = useAlert();
  
  // 2. 引入 YAML 弹窗状态
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);

  // 3. 引入复制功能的逻辑
  const handleCopyName = async () => {
    if (data?.metadata?.name) {
      await copyToClipboard(String(data.metadata.name));
      success('Copied name');
    }
  };

  const handleCopyUID = async () => {
    if (data?.metadata?.uid) {
      await copyToClipboard(String(data.metadata.uid));
      success('Copied ID');
    }
  };

  return (
    <>
      {/* 4. 使用 main 分支的 DetailDialog 作为容器 */}
      <DetailDialog
        open={open}
        onClose={onClose}
        data={data}
        title={`${t("common.node")} ${t("actions.detail")}`}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '& .row': {
              display: 'flex',
              backgroundColor: theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
              padding: '8px 16px',
              borderRadius: '4px',
            },
            '& .row:not(:last-child)': {
              marginBottom: '8px',
            },
            '& .label': {
              flex: 1,
              fontWeight: 'bold',
            },
            '& .value': {
              flex: 2,
              wordBreak: 'break-all', // 防止长字符串撑破布局
            },
          }}
        >
          {/* 5. 内容区域：使用 main 分支的国际化标签和格式化函数 */}
          <Box className="row">
            <Typography className="label">{t("table.name")}:</Typography>
            <Typography className="value">{data?.metadata?.name}</Typography>
            <Typography className="label">{t("table.status")}:</Typography>
            <Typography className="value">{formatStatus(getNodeStatus(data), currentLanguage)}</Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.id")}:</Typography>
            <Typography className="value">{data?.metadata?.uid}</Typography>
            <Typography className="label">{t("table.description")}:</Typography>
            <Typography className="value">{data?.metadata?.annotations?.['node.alpha.kubernetes.io/ttl']}</Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.creationTime")}:</Typography>
            <Typography className="value">{formatDateTime(data?.metadata?.creationTimestamp, currentLanguage)}</Typography>
            <Typography className="label">{t("table.hostname")}:</Typography>
            <Typography className="value">{data?.status?.addresses?.find(address => address.type === 'Hostname')?.address}</Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.system")}:</Typography>
            <Typography className="value">
              {data?.status?.nodeInfo?.osImage} |{" "}
              {data?.status?.nodeInfo?.operatingSystem} |{" "}
              {data?.status?.nodeInfo?.architecture} |{" "}
              {data?.status?.nodeInfo?.kernelVersion}
            </Typography>
            <Typography className="label">{t("table.ip")}:</Typography>
            <Typography className="value">{data?.status?.addresses?.find(address => address.type === 'InternalIP')?.address}</Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.configuration")}:</Typography>
            <Typography className="value">
              {data?.status?.capacity?.cpu}Cpu |{" "}
              {convertKiToGTM(data?.status?.capacity?.memory || "0")}
            </Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.containerRuntimeVersion")}:</Typography>
            <Typography className="value">{data?.status?.nodeInfo?.containerRuntimeVersion}</Typography>
          </Box>
          <Box className="row">
            <Typography className="label">{t("table.kubeletVersion")}:</Typography>
            <Typography className="value">{data?.status?.nodeInfo?.kubeletVersion}</Typography>
          </Box>
        </Box>

        {/* 6. 底部按钮：重新加入 feat 分支的功能按钮 */}
        <DialogActions>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>
          <Button onClick={handleCopyName} variant="outlined">Copy Name</Button>
          <Button onClick={handleCopyUID} variant="outlined">Copy ID</Button>
          <Button onClick={() => setYamlDialogOpen(true)} variant="contained">
            YAML
          </Button>
        </DialogActions>
      </DetailDialog>

      {/* 7. YAML 弹窗组件 */}
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={data}
      />
    </>
  );
}