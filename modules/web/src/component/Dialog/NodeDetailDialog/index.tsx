import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { Node } from '@/types/node';
import { getNodeStatus } from '@/helper/status';
import { convertKiToGTM } from '@/helper/util';
import { useI18n } from '@/hook/useI18n'
import { formatRelativeTime, formatStatus, formatDateTime } from '@/helper/localization';

interface NodeDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Node;
}

export function NodeDetailDialog({ open, onClose, data }: NodeDetailDialogProps) {
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const theme = useTheme();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const handleYamlOpen = () => {
    setYamlDialogOpen(true);
  };

  const handleYamlClose = () => {
    setYamlDialogOpen(false);
  };

  return (
    <>
      <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>{t("common.node")} {t("actions.detail")}</DialogTitle>
        <DialogContent>
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
              },
            }}
          >
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
              <Typography className="value">{data?.metadata?.creationTimestamp}</Typography>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("actions.cancel")}</Button>
          <Button onClick={handleYamlOpen} variant="contained">
            {t("actions.yaml")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* YAML Viewer Dialog */}
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlClose}
        content={data} // Pass YAML content
      />
    </>
  );
}
