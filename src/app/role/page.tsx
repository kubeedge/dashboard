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

const columns: ColumnDefinition<Role>[] = [
  {
    name: 'Namespace',
    render: (role) => role?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (role) => role?.metadata?.name,
  },
  {
    name: 'Creation time',
    render: (role) => role.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RolesPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRoles(namespace);
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
      title: 'Delete Role',
      content: `Are you sure to delete Role ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRole(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Role');
        }
      },
      onCancel: () => {},
    })
  };

  const handleOnSubmit = async (_: any, record: Role) => {
    try {
      await createRole(record?.metadata?.namespace || namespace || 'default', record);
      mutate();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Role');
    }
  }

  const handleAddRoleDialogClose = () => {
    setAddRoleDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Roles"
          addButtonLabel="Add Role"
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
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={handleAddRoleDialogClose}
        onSubmit={handleOnSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
