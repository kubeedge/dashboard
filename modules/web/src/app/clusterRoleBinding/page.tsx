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

const columns: ColumnDefinition<ClusterRoleBinding>[] = [
  {
    name: 'Name',
    render: (clusterRoleBinding) => clusterRoleBinding?.metadata?.name,
  },
  {
    name: 'RoleRef',
    render: (clusterRoleBinding) => JSON.stringify(clusterRoleBinding.roleRef),
  },
  {
    name: 'Creation time',
    render: (clusterRoleBinding) => clusterRoleBinding.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ClusterRoleBindingPage() {
  const { data, mutate } = useListClusterRoleBindings();
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
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get ClusterRoleBinding');
    }
  };

  const handleYamlDialogClose = () => setYamlDialogOpen(false);

  const handleDeleteClick = (_:any, row: ClusterRoleBinding) => {
    showConfirmDialog({
      title: 'Delete ClusterRoleBinding',
      content: `Are you sure to delete ClusterRoleBinding ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRoleBinding(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete ClusterRoleBinding');
        }

      },
      onCancel: () => {},
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
        <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
          <TableCard
            title="ClusterRoleBinding"
            addButtonLabel="Add ClusterRoleBinding"
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleQueryClick}
            onViewOptionsClick={() => alert('View options button clicked')}
            onDetailClick={handleYamlClick}
            onDeleteClick={handleDeleteClick}
            detailButtonLabel="YAML"
            deleteButtonLabel="Delete"
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
