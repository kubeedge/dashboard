
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, content, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary" autoFocus>
        Ok
      </Button>
    </DialogActions>
  </Dialog>
);

const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<Omit<ConfirmDialogProps, 'open'>>();

  const showConfirmDialog = (props: Omit<ConfirmDialogProps, 'open'>) => {
    setDialogProps(props);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (dialogProps?.onConfirm) {
      dialogProps.onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (dialogProps?.onCancel) {
      dialogProps.onCancel();
    }
    setOpen(false);
  };

  const ConfirmDialogComponent = dialogProps ? (
    <ConfirmDialog
      open={open}
      title={dialogProps.title}
      content={dialogProps.content}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { showConfirmDialog, ConfirmDialogComponent };
};

export default useConfirmDialog;