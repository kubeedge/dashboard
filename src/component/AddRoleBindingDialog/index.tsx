import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, IconButton, MenuItem, Select } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { RoleBinding, RoleRef, Subject } from '@/types/roleBinding';
import { useListNamespaces } from '@/api/namespace';

interface AddRoleBindingDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: RoleBinding) => void;
}

const AddRoleBindingDialog = ({ open, onClose, onSubmit }: AddRoleBindingDialogProps) => {
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [roleRef, setRoleRef] = useState<RoleRef>({ kind: '', name: '', apiGroup: '' });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { data } = useListNamespaces();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(event.target.value);
  };

  const handleRoleRefChange = (field: string, value: string) => {
    setRoleRef(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const updatedSubjects = [...subjects];
    (updatedSubjects as any)[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { kind: '', name: '', apiGroup: '' }]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    onSubmit?.(event, {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: 'RoleBinding',
      metadata: {
        namespace,
        name,
      },
      roleRef,
      subjects,
    });
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNamespace('');
    setName('');
    setRoleRef({ kind: '', name: '', apiGroup: '' });
    setSubjects([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add RoleBinding</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Namespace"
            value={namespace}
            onChange={(event) => setNamespace(event.target.value)}
            sx={{ marginBottom: '16px' }}
            required
            placeholder="Namespace"
          >
            {data?.items?.map((item) => (
              <MenuItem key={item.metadata?.uid} value={item?.metadata?.name}>
                {item?.metadata?.name}
              </MenuItem>
            ))}
            </Select>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            sx={{ marginBottom: '16px' }}
            required
            placeholder="Name"
          />
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="subtitle1">RoleRef</Typography>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Kind"
                variant="outlined"
                value={roleRef.kind}
                onChange={(e) => handleRoleRefChange('kind', e.target.value)}
                sx={{ flex: 1 }}
                required
                placeholder="Kind"
              />
              <TextField
                label="Name"
                variant="outlined"
                value={roleRef.name}
                onChange={(e) => handleRoleRefChange('name', e.target.value)}
                sx={{ flex: 1 }}
                required
                placeholder="Name"
              />
              <TextField
                label="ApiGroup"
                variant="outlined"
                value={roleRef.apiGroup}
                onChange={(e) => handleRoleRefChange('apiGroup', e.target.value)}
                sx={{ flex: 1 }}
                placeholder="ApiGroup"
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1">Subjects</Typography>
            {subjects.map((subject, index) => (
              <Box key={index} sx={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                  label="Kind"
                  variant="outlined"
                  value={subject.kind}
                  onChange={(e) => handleSubjectChange(index, 'kind', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  placeholder="Kind"
                />
                <TextField
                  label="Name"
                  variant="outlined"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  placeholder="Name"
                />
                <TextField
                  label="ApiGroup"
                  variant="outlined"
                  value={subject.apiGroup}
                  onChange={(e) => handleSubjectChange(index, 'apiGroup', e.target.value)}
                  sx={{ flex: 1 }}
                  placeholder="ApiGroup"
                />
                <IconButton onClick={() => handleRemoveSubject(index)} color="error">
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddSubject}
              sx={{ backgroundColor: 'white', width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              startIcon={<AddIcon />}
            >
              Add Subject
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleBindingDialog;
