'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createRoleBinding, deleteRoleBinding, getRoleBinding, useListRoleBindings } from '@/api/roleBinding';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddRoleBindingDialog from '@/component/AddRoleBindingDialog';
import { RoleBinding } from '@/types/roleBinding';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<RoleBinding | any>[] = [
  {
    name: 'Namespace',
    render: (rolebinding) => rolebinding?.metadata?.namespace || rolebinding?.namespace,
  },
  {
    name: 'Name',
    render: (rolebinding) => rolebinding?.metadata?.name || rolebinding?.name,
  },
  {
    name: 'RoleRef',
    render: (rolebinding) => rolebinding?.roleRef?.name || rolebinding?.role || JSON.stringify(rolebinding?.roleRef),
  },
  {
    name: 'Creation time',
    render: (rolebinding) => rolebinding?.metadata?.creationTimestamp || rolebinding?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RolebindingsPage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');
  
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    ...(name && { 'name': `*${name}*` }),
  }), [namespace, page, pageSize, sort, order, name]);
  
  const { data, mutate } = useListRoleBindings(params);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleBindingDialogOpen, setAddRoleBindingDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

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
          noPagination={true}
        />
        
        {/* New pagination controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              select
              label="Rows per page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="namespace">Namespace</MenuItem>
              <MenuItem value="role">Role</MenuItem>
              <MenuItem value="creationTimestamp">Creation Time</MenuItem>
            </TextField>
            
            <TextField
              select
              label="Order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              size="small"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
            
            <TextField
              label="Name filter"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              placeholder="Search by name..."
              sx={{ minWidth: 150 }}
            />
          </Box>
          
          <Pagination
            count={data?.total ? Math.ceil(data.total / pageSize) : 1}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
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
