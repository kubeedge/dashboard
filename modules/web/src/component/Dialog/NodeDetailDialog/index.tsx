import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { Node } from '@/types/node';
import { getNodeStatus } from '@/helper/status';
import { convertKiToGTM } from '@/helper/util';

interface NodeDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Node;
}

export function NodeDetailDialog({ open, onClose, data }: NodeDetailDialogProps) {
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const theme = useTheme();

  const handleYamlOpen = () => {
    setYamlDialogOpen(true);
  };

  const handleYamlClose = () => {
    setYamlDialogOpen(false);
  };

  return (
    <>
      <Dialog open={!!open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Node Detail</DialogTitle>
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
              <Typography className="label">Name:</Typography>
              <Typography className="value">{data?.metadata?.name}</Typography>
              <Typography className="label">Status:</Typography>
              <Typography className="value">{getNodeStatus(data)}</Typography>
            </Box>
            <Box className="row">
              <Typography className="label">ID:</Typography>
              <Typography className="value">{data?.metadata?.uid}</Typography>
              <Typography className="label">Description:</Typography>
              <Typography className="value">{data?.metadata?.annotations?.['node.alpha.kubernetes.io/ttl']}</Typography>
            </Box>
            <Box className="row">
              <Typography className="label">Creation time:</Typography>
              <Typography className="value">{data?.metadata?.creationTimestamp}</Typography>
              <Typography className="label">Hostname:</Typography>
              <Typography className="value">{data?.status?.addresses?.find(address => address.type === 'Hostname')?.address}</Typography>
            </Box>
            <Box className="row">
              <Typography className="label">System:</Typography>
              <Typography className="value">
                {data?.status?.nodeInfo?.osImage} |{" "}
                {data?.status?.nodeInfo?.operatingSystem} |{" "}
                {data?.status?.nodeInfo?.architecture} |{" "}
                {data?.status?.nodeInfo?.kernelVersion}
              </Typography>
              <Typography className="label">IP:</Typography>
              <Typography className="value">{data?.status?.addresses?.find(address => address.type === 'InternalIP')?.address}</Typography>
            </Box>
            <Box className="row">
              <Typography className="label">Configuration:</Typography>
              <Typography className="value">
                {data?.status?.capacity?.cpu}Cpu |{" "}
                {convertKiToGTM(data?.status?.capacity?.memory || "0")}
              </Typography>
            </Box>
            <Box className="row">
              <Typography className="label">Container runtime version:</Typography>
              <Typography className="value">{data?.status?.nodeInfo?.containerRuntimeVersion}</Typography>
            </Box>
            <Box className="row">
              <Typography className="label">Edge side software version:</Typography>
              <Typography className="value">{data?.status?.nodeInfo?.kubeletVersion}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleYamlOpen} variant="contained">
            YAML
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
