'use client';

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { createClusterRole, deleteClusterRole, getClusterRole, useListClusterRoles } from '@/api/clusterRole';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddClusterRoleDialog from '@/component/AddClusterRoleDialog';
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
  const { setErrorMessage } = useAlert();

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
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get ClusterRole');
    }
  };

  const handleSubmit = async (_: any, record: ClusterRole) => {
    try {
      await createClusterRole(record);
      mutate();
      handleAddDialogClose();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create ClusterRole');
    }
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
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete ClusterRole');
        }

      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
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
        onSubmit={handleSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
