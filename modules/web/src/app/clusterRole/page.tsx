'use client';

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { createClusterRole, deleteClusterRole, getClusterRole, useListClusterRoles } from '@/api/clusterRole';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import AddClusterRoleDialog from '@/components/Form/AddClusterRoleDialog';
import { ClusterRole } from '@/types/clusterRole';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<ClusterRole>[] = [
  {
    name: 'Name',
    render: (clusterrole) => clusterrole?.metadata?.name,
  },
  {
    name: 'Creation time',
    render: (clusterrole) => clusterrole.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function ClusterrolesPage() {
  const { data, mutate } = useListClusterRoles();
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [currentYamlContent, setCurrentYamlContent] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ClusterRole) => {
    try {
      const resp = await getClusterRole(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get ClusterRole');
    }
  };

  const handleSubmit = async (_: any, record: ClusterRole) => {
    await createClusterRole(record);
    mutate();
  }

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: ClusterRole) => {
    showConfirmDialog({
      title: 'Delete ClusterRole',
      content: `Are you sure to delete ClusterRole ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRole(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to delete ClusterRole');
        }

      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title="Clusterroles"
          addButtonLabel="Add Clusterroles"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onQueryClick={handleQueryClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
        />
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      <AddClusterRoleDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}

      />
      {ConfirmDialogComponent}
    </Box>
  );
}
