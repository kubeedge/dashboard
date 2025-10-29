'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createRole, deleteRole, getRole, useListRoles } from '@/api/role';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddRoleDialog from '@/component/AddRoleDialog';
import { Role } from '@/types/role';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Role | any>[] = [
  {
    name: 'Namespace',
    render: (role) => role?.metadata?.namespace || role?.namespace,
  },
  {
    name: 'Name',
    render: (role) => role?.metadata?.name || role?.name,
  },
  {
    name: 'Creation time',
    render: (role) => role?.metadata?.creationTimestamp || role?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RolesPage() {
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
  
  const { data, mutate } = useListRoles(params);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

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
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={handleAddRoleDialogClose}
        onSubmit={handleOnSubmit}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
