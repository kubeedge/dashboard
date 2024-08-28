// src/component/AddRuleDialog.js
import React, { useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { ServiceAccount } from '@/types/serviceAccount';
import { useListNamespaces } from '@/api/namespace';
import { useListSecrets } from '@/api/secret';

interface AddServiceAccountDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ServiceAccount) => void;
}

const AddServiceAccountDialog = ({ open, onClose, onSubmit }: AddServiceAccountDialogProps) => {
  const [namespace, setNamespace] = React.useState('');
  const [name, setName] = React.useState('');
  const [secrets, setSecrets] = React.useState([]);
  const [formErrors, setFormErrors] = React.useState<any>({});
  const namespaceData = useListNamespaces()?.data;
  const { data, mutate } = useListSecrets(namespace);

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const newErrors: any = {};
    if (!namespace) newErrors.namespace = 'Missing namespace';
    if (!name) newErrors.name = 'Missing name';
    if (!secrets) newErrors.source = 'Missing secrets';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
    } else {
      onSubmit?.(event, {
        apiVersion: 'v1',
        kind: 'ServiceAccount',
        metadata: {
          namespace,
          name,
        },
        secrets: secrets.map((secret) => ({
          name: secret,
        })),
      });
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setSecrets([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add ServiceAccounts</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal" error={Boolean(formErrors.namespace)}>
            <InputLabel required>Namespace</InputLabel>
            <Select
              value={namespace}
              onChange={(event) => setNamespace(event.target.value)}
              placeholder="Namespace"
            >
              {namespaceData?.items?.map((item) => (
                <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                  {item?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.namespace && (
              <FormHelperText>{formErrors.namespace}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Name"
            placeholder="Name"
            variant="outlined"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
          />

          <FormControl fullWidth margin="normal" error={Boolean(formErrors.secrets)}>
            <InputLabel required>Secrets</InputLabel>
            <Select<string[]>
              multiple
              value={secrets}
              // TODO: remove it
              // @ts-ignore
              onChange={(event) => setSecrets(event.target.value)}
              placeholder="Secrets"
            >
              {data?.items?.map((secret) => (
                <MenuItem key={secret?.metadata?.uid} value={secret?.metadata?.name}>
                  {secret?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
            {formErrors.secrets && (
              <FormHelperText>{formErrors.secrets}</FormHelperText>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default AddServiceAccountDialog;
