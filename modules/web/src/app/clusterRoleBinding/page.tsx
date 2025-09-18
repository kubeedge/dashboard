'use client';

import React from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createClusterRoleBinding, deleteClusterRoleBinding, getClusterRoleBinding, useListClusterRoleBindings } from '@/api/clusterRoleBinding';
import AddClusterRoleBindingDialog from '@/component/AddClusterRoleBindingDialog';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { ClusterRoleBinding } from '@/types/clusterRoleBinding';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ClusterRoleBindingPage() {
  const { data, mutate } = useListClusterRoleBindings();
  const { t } = useI18n();

  const columns: ColumnDefinition<ClusterRoleBinding>[] = [
    {
      name: t('table.name'),
      render: (clusterRoleBinding) => clusterRoleBinding?.metadata?.name,
    },
    {
      name: t('table.roleRef'),
      render: (clusterRoleBinding) => JSON.stringify(clusterRoleBinding.roleRef),
    },
    {
      name: t('table.creationTime'),
      render: (clusterRoleBinding) => clusterRoleBinding.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleSubmit = async (_: any, record: ClusterRoleBinding) => {
    await createClusterRoleBinding(record);
    mutate();
  };

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ClusterRoleBinding) => {
    try {
      const resp = await getClusterRoleBinding(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => setYamlDialogOpen(false);

  const handleDeleteClick = (_: any, row: ClusterRoleBinding) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.clusterRoleBinding'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRoleBinding(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }

      },
      onCancel: () => { },
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
        <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
          <TableCard
            title={t('common.clusterRoleBinding')}
            addButtonLabel={t('actions.add') + ' ' + t('common.clusterRoleBinding')}
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleQueryClick}
            onViewOptionsClick={() => alert('View options button clicked')}
            onDetailClick={handleYamlClick}
            onDeleteClick={handleDeleteClick}
            detailButtonLabel="YAML"
            deleteButtonLabel={t('actions.delete')}
          />
        </Box>
        <AddClusterRoleBindingDialog
          open={addDialogOpen}
          onClose={handleAddDialogClose}
          onSubmit={handleSubmit}
        />
        <YAMLViewerDialog
          open={yamlDialogOpen}
          onClose={handleYamlDialogClose}
          content={currentYamlContent}
        />
        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
