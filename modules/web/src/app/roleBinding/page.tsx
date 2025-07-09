'use client';

import React, { useEffect } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { createRoleBinding, deleteRoleBinding, getRoleBinding, useListRoleBindings } from '@/api/roleBinding';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddRoleBindingDialog from '@/component/AddRoleBindingDialog';
import { RoleBinding } from '@/types/roleBinding';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<RoleBinding>[] = [
  {
    name: 'Namespace',
    render: (rolebinding) => rolebinding?.metadata?.namespace,
  },
  {
    name: 'Name',
    render: (rolebinding) => rolebinding?.metadata?.name,
  },
  {
    name: 'RoleRef',
    render: (rolebinding) => JSON.stringify(rolebinding?.roleRef),
  },
  {
    name: 'Creation time',
    render: (rolebinding) => rolebinding.metadata?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RolebindingsPage() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListRoleBindings(namespace);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleBindingDialogOpen, setAddRoleBindingDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = () => setAddRoleBindingDialogOpen(true);

  const handleYamlClick = async (_: any, row: RoleBinding) => {
    try {
      const resp = await getRoleBinding(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get RoleBinding');
    }
  };

  const handleOnSubmit = async (_: any, newRoleBinding: RoleBinding) => {
    await createRoleBinding(newRoleBinding?.metadata?.namespace || namespace || 'default', newRoleBinding);
    mutate();
  }

  const handleYamlDialogClose = () => setYamlDialogOpen(false);
  const handleAddRoleBindingDialogClose = () => setAddRoleBindingDialogOpen(false);

  const handleDeleteClick = (_: any, row: RoleBinding) => {
    showConfirmDialog({
      title: 'Delete RoleBinding',
      content: `Are you sure to delete RoleBiding ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRoleBinding(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete RoleBinding');
        }
      },
      onCancel: () => {},
    })
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Rolebindings"
          addButtonLabel="Add Rolebindings"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
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
      <AddRoleBindingDialog
        open={addRoleBindingDialogOpen}
        onClose={handleAddRoleBindingDialogClose}
        onSubmit={handleOnSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
