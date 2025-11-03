import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import SSEOutputArea from '@/component/Common/SSEOutputArea';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface KeinkDialogProps {
  open?: boolean;
  onClose?: () => void;
}

const KeinkDialog = ({ open, onClose }: KeinkDialogProps) => {
  const [sseData, setSseData] = useState<string[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (open) {
      setSseData([]); // Clear previous data
      const eventSource = new EventSource('/sse/keink');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        setSseData((prev) => [...prev, e.data]);
      };

      eventSource.onerror = (err) => {
        setSseData((prev) => [...prev, `Error occurred:  ${err}`]);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [open]);

  return (
    <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Install KubeEdge by Keink</DialogTitle>
      <DialogContent>
        <SSEOutputArea messages={sseData} />
      </DialogContent>
    </Dialog>
  )
};

export default KeinkDialog;
