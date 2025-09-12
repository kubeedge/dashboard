'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { createRole, deleteRole, getRole, useListRoles } from '@/api/role';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddRoleDialog from '@/component/AddRoleDialog';
import { Role } from '@/types/role';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function RolePage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRoles(namespace);
  const { t } = useI18n();

  const columns: ColumnDefinition<Role>[] = [
    {
      name: t('table.namespace'),
      render: (role) => role?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (role) => role?.metadata?.name,
    },
    {
      name: t('table.age'),
      render: (role) => role.metadata?.creationTimestamp,
    },
    {
      name: t('table.actions'),
      renderOperation: true,
    },
  ];
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => {
    setAddRoleDialogOpen(true);
  };

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: Role) => {
    try {
      const resp = await getRole(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Role');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: Role) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.role'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRole(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  const handleOnSubmit = async (_: any, record: Role) => {
    await createRole(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  const handleAddRoleDialogClose = () => {
    setAddRoleDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title={t('common.role')}
          addButtonLabel={t('actions.add') + ' ' + t('common.role')}
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
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={handleAddRoleDialogClose}
        onSubmit={handleOnSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
