import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useI18n } from '@/hook/useI18n';
import { YAMLViewerDialog } from '@/component';
import { title } from 'process';

interface DetailDialogProps<T> {
  title?: string;
  open?: boolean;
  onClose?: () => void;
  data?: T;
  children?: React.ReactNode;
}

function DetailDialog<T>({ open, onClose, data, children, title }: DetailDialogProps<T>) {
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("actions.cancel")}</Button>
          <Button onClick={() => setYamlDialogOpen(true)} variant="contained">
            {t("actions.yaml")}
          </Button>
        </DialogActions>
      </Dialog>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={data}
      />
    </>
  );
}

export default DetailDialog;
