import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box, Typography, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { RoleBinding, RoleRef, Subject } from '@/types/roleBinding';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddRoleBindingDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: RoleBinding) => void;
}

const AddRoleBindingDialog = ({ open, onClose, onSubmit }: AddRoleBindingDialogProps) => {
  const { t } = useI18n();
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [roleRef, setRoleRef] = useState<RoleRef>({ kind: '', name: '', apiGroup: '' });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { data } = useListNamespaces();
  const { setErrorMessage } = useAlert();

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

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await onSubmit?.(event, {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'RoleBinding',
        metadata: {
          namespace,
          name,
        },
        roleRef,
        subjects,
      });
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create RoleBinding');
    }
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
      <DialogTitle>{t('actions.add')} {t('common.roleBinding')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>{t('table.namespace')}</InputLabel>
            <Select
              label={t('table.namespace')}
              value={namespace}
              onChange={(event) => setNamespace(event.target.value)}
              sx={{ marginBottom: '16px' }}
              required
              placeholder={t('form.namespacePlaceholder')}
            >
              {data?.items?.map((item) => (
                <MenuItem key={item.metadata?.uid} value={item?.metadata?.name}>
                  {item?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('table.name')}
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            sx={{ marginBottom: '16px' }}
            required
            placeholder={t('form.namePlaceholder')}
          />
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="subtitle1">{t('table.roleRef')}</Typography>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                label={t('table.kind')}
                variant="outlined"
                value={roleRef.kind}
                onChange={(e) => handleRoleRefChange('kind', e.target.value)}
                sx={{ flex: 1 }}
                required
                placeholder={t('table.kind')}
              />
              <TextField
                label={t('table.name')}
                variant="outlined"
                value={roleRef.name}
                onChange={(e) => handleRoleRefChange('name', e.target.value)}
                sx={{ flex: 1 }}
                required
                placeholder={t('form.namePlaceholder')}
              />
              <TextField
                label={t('table.apiGroup')}
                variant="outlined"
                value={roleRef.apiGroup}
                onChange={(e) => handleRoleRefChange('apiGroup', e.target.value)}
                sx={{ flex: 1 }}
                placeholder={t('table.apiGroup')}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1">{t('table.subjects')}</Typography>
            {subjects.map((subject, index) => (
              <Box key={index} sx={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <TextField
                  label={t('table.kind')}
                  variant="outlined"
                  value={subject.kind}
                  onChange={(e) => handleSubjectChange(index, 'kind', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  placeholder={t('table.kind')}
                />
                <TextField
                  label={t('table.name')}
                  variant="outlined"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  placeholder={t('form.namePlaceholder')}
                />
                <TextField
                  label={t('table.apiGroup')}
                  variant="outlined"
                  value={subject.apiGroup}
                  onChange={(e) => handleSubjectChange(index, 'apiGroup', e.target.value)}
                  sx={{ flex: 1 }}
                  placeholder={t('table.apiGroup')}
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
              {t('table.addSubject')}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <Button onClick={handleClose}>{t('actions.cancel')}</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{t('actions.submit')}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleBindingDialog;
