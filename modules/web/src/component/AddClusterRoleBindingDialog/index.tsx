import React from 'react';
import { Box, TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ClusterRoleBinding, Subject, RoleRef } from '@/types/clusterRoleBinding';
import { useListNamespaces } from '@/api/namespace';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

interface AddClusterRoleBindingDialogProps {
  open?: boolean;
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ClusterRoleBinding) => void;
}

const AddClusterRoleBindingDialog = ({ open, onClose, onSubmit }: AddClusterRoleBindingDialogProps) => {
  const { t } = useI18n();
  const [name, setName] = React.useState('');
  const [roleRef, setRoleRef] = React.useState<RoleRef>({ kind: '', name: '', apiGroup: '' });
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const { data } = useListNamespaces();
  const { setErrorMessage } = useAlert();

  const handleRoleRefChange = (field: string, value: string) => setRoleRef(prev => ({ ...prev, [field]: value }));
  const handleSubjectChange = (index: number, field: string, value: string) => {
    const updatedSubjects = [...subjects];
    (updatedSubjects as any)[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const handleAddSubject = () => setSubjects([...subjects, { kind: '', name: '', namespace: '' }]);
  const handleRemoveSubject = (index: number) => setSubjects(subjects.filter((_, i) => i !== index));

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await onSubmit?.(event, {
        apiVersion: 'rbac.authorization.k8s.io/v1',
        kind: 'ClusterRoleBinding',
        metadata: {
          name,
        },
        roleRef,
        subjects,
      });
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create ClusterRoleBinding');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setName('');
    setRoleRef({ kind: '', name: '', apiGroup: '' });
    setSubjects([]);
    onClose?.(event);
  }

  return (
    <Dialog open={!!open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('actions.add')} {t('common.clusterRoleBinding')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            label={t('table.name')}
            placeholder={t('form.namePlaceholder')}
            margin="dense"
            variant="outlined"
            required
            error={!name}
            helperText={!name && t('table.missingName')}
            value={name}
            onChange={(event: any) => setName(event.target.value)}
            sx={{ marginBottom: '16px' }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography variant="subtitle1">{t('table.roleRef')}</Typography>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                label={t('table.kind')}
                placeholder={t('table.kind')}
                variant="outlined"
                required
                error={!roleRef.kind}
                helperText={!roleRef.kind && t('table.missingRoleRefKind')}
                value={roleRef.kind}
                onChange={(e) => handleRoleRefChange('kind', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t('table.name')}
                placeholder={t('form.namePlaceholder')}
                variant="outlined"
                required
                error={!roleRef.name}
                helperText={!roleRef.name && t('table.missingRoleRefName')}
                value={roleRef.name}
                onChange={(e) => handleRoleRefChange('name', e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                label={t('table.apiGroup')}
                placeholder={t('table.apiGroup')}
                variant="outlined"
                value={roleRef.apiGroup}
                onChange={(e) => handleRoleRefChange('apiGroup', e.target.value)}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle1">{t('table.subjects')}</Typography>
            {subjects.map((subject, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                <TextField
                  label={t('table.kind')}
                  placeholder={t('table.kind')}
                  variant="outlined"
                  required
                  error={!subject.kind}
                  helperText={!subject.kind && t('table.missingSubjectKind')}
                  value={subject.kind}
                  onChange={(e) => handleSubjectChange(index, 'kind', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label={t('table.name')}
                  placeholder={t('form.namePlaceholder')}
                  variant="outlined"
                  required
                  error={!subject.name}
                  helperText={!subject.name && t('table.missingSubjectName')}
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label={t('table.namespace')}
                  placeholder={t('form.namespacePlaceholder')}
                  variant="outlined"
                  select
                  required
                  error={!subject.namespace}
                  helperText={!subject.namespace && t('table.missingSubjectNamespace')}
                  value={subject.namespace}
                  onChange={(e) => handleSubjectChange(index, 'namespace', e.target.value)}
                  sx={{ flex: 1 }}
                >
                  {data?.items?.map((item) => (
                    <MenuItem key={item.metadata?.uid} value={item?.metadata?.name}>
                      {item?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
                {subjects.length > 1 && (
                  <IconButton onClick={() => handleRemoveSubject(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              variant="outlined"
              sx={{ backgroundColor: 'white', color: 'black', width: '100%', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={handleAddSubject}
            >
              <AddIcon /> {t('table.addSubject')}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
            <Button variant="outlined" onClick={handleClose}>
              {t('actions.cancel')}
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {t('actions.submit')}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddClusterRoleBindingDialog;
