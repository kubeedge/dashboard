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
import { useI18n } from '@/hook/useI18n';

export default function ClusterrolesPage() {
  const { data, mutate } = useListClusterRoles();
  const { t } = useI18n();

  const columns: ColumnDefinition<ClusterRole>[] = [
    {
      name: t('table.name'),
      render: (clusterrole) => clusterrole?.metadata?.name,
    },
    {
      name: t('table.creationTime'),
      render: (clusterrole) => clusterrole.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];
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
      setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
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
      title: t('actions.delete') + ' ' + t('common.clusterRole'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRole(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }

      },
      onCancel: () => { },
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.clusterRole')}
          addButtonLabel={t('actions.add') + ' ' + t('common.clusterRole')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onQueryClick={handleQueryClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
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
