import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button, IconButton, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useListNamespaces } from '@/api/namespace';
import { PolicyRule, Role } from '@/types/role';

interface AddRoleDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Role) => void;
}

const AddRoleDialog = ({ open, onClose, onSubmit }: AddRoleDialogProps) => {
  const [namespace, setNamespace] = useState<string>('');
  const [name, setName] = useState('');
  const [rules, setRules] = useState<PolicyRule[]>([{ verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
  const { data } = useListNamespaces();

  const handleNamespaceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNamespace(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.target.value);
  };

  const handleRuleChange = (index: number, field: string, value: string) => {
    const newRules = [...rules];
    (newRules as any)[index][field] = [value];
    setRules(newRules);
  };

  const handleAddRule = () => {
    setRules([...rules, { verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,) => {
    onSubmit?.(event, {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'Role',
      metadata: {
        namespace,
        name,
      },
      rules,
    });
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setNamespace('');
    setName('');
    setRules([{ verbs: [''], apiGroups: [''], resources: [''], resourceNames: [''] }]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Role</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label="Namespace"
            placeholder="Please select namespace"
            variant="outlined"
            select
            value={namespace}
            onChange={handleNamespaceChange}
            required
            sx={{ minWidth: 300 }}
            helperText={!namespace.length && 'Miss namespace'}
          >
            {data?.items?.map(item => (
              <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
                </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Name"
            placeholder="Please enter name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            required
            helperText={!name && 'Miss name'}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>Rules</Typography>
            {rules.map((rule, index) => (
              <Box key={index} sx={{ marginBottom: '16px' }}>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                  <TextField
                    label="Verbs"
                    placeholder="Please input verbs"
                    variant="outlined"
                    value={rule.verbs}
                    onChange={(e) => handleRuleChange(index, 'verbs', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.verbs && 'Verbs cannot be empty'}
                  />
                  <TextField
                    label="ApiGroups"
                    placeholder="Please input apiGroups"
                    variant="outlined"
                    value={rule.apiGroups}
                    onChange={(e) => handleRuleChange(index, 'apiGroups', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.apiGroups && 'ApiGroups cannot be empty'}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <TextField
                    label="Resources"
                    placeholder="Please input resources"
                    variant="outlined"
                    value={rule.resources}
                    onChange={(e) => handleRuleChange(index, 'resources', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.resources && 'Resources cannot be empty'}
                  />
                  <TextField
                    label="ResourceNames"
                    placeholder="Please input resourceNames"
                    variant="outlined"
                    value={rule.resourceNames}
                    onChange={(e) => handleRuleChange(index, 'resourceNames', e.target.value)}
                    required
                    sx={{ flex: 1 }}
                    helperText={!rule.resourceNames && 'ResourceNames cannot be empty'}
                  />
                  {index === rules.length - 1 && (
                    <IconButton onClick={() => handleRemoveRule(index)} color="error">
                      <RemoveIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddRule}>
              Add Rule
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
