'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { Box } from '@mui/material';
import { createRole, deleteRole, getRole, useListRoles } from '@/api/role';
import YAMLViewerDialog from '@/components/Dialog/YAMLViewerDialog';
import AddRoleDialog from '@/components/Form/AddRoleDialog';
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
  const { error, success } = useAlert();

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
      Error(error?.response?.data?.message || error?.message || 'Failed to get Role');
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
          Error(error?.response?.data?.message || error?.message || 'Failed to delete Role');
        }
      },
      onCancel: () => {},
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
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
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
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
