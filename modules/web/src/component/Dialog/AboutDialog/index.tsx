import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Link, Stack } from '@mui/material';
import Image from 'next/image';
import { useI18n } from '@/hook/useI18n';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
  const { t } = useI18n();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('common.about')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Image src="/icons/favicon.png" alt="KubeEdge" width={64} height={64} style={{ marginBottom: 16 }} />
          <Typography variant="h6" gutterBottom>
            KubeEdge {t('common.dashboard')}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" paragraph>
            {t('common.aboutDescription')}
          </Typography>
          <Stack spacing={1} alignItems="center">
            <Link href="https://kubeedge.io" target="_blank" rel="noopener noreferrer">
              {t('common.website')}
            </Link>
            <Link href="https://github.com/kubeedge/dashboard" target="_blank" rel="noopener noreferrer">
              {t('common.github')}
            </Link>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
