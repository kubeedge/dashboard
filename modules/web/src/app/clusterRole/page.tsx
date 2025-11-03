'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createClusterRole, deleteClusterRole, getClusterRole, useListClusterRoles } from '@/api/clusterRole';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddClusterRoleDialog from '@/component/Form/AddClusterRoleDialog';
import { ClusterRole } from '@/types/clusterRole';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ClusterRolesPage() {
  const { t } = useI18n();

  const columns: ColumnDefinition<ClusterRole | any>[] = [
    {
      name: t('table.name'),
      render: (clusterRole) => clusterRole?.metadata?.name || clusterRole?.name,
    },
    {
      name: t('table.creationTime'),
      render: (clusterRole) => clusterRole?.metadata?.creationTimestamp || clusterRole?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');

  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    ...(name && { 'name': `*${name}*` }),
  }), [page, pageSize, sort, order, name]);

  const { data, mutate } = useListClusterRoles(params);
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [currentYamlContent, setCurrentYamlContent] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ClusterRole) => {
    try {
      const resp = await getClusterRole(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
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
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }

      },
      onCancel: () => { },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
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
      <AddClusterRoleDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}

      />
      {ConfirmDialogComponent}
    </Box>
  );
}
