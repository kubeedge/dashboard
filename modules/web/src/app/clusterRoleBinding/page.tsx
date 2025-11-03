'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createClusterRoleBinding, deleteClusterRoleBinding, getClusterRoleBinding, useListClusterRoleBindings } from '@/api/clusterRoleBinding';
import AddClusterRoleBindingDialog from '@/component/Form/AddClusterRoleBindingDialog';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ClusterRoleBinding } from '@/types/clusterRoleBinding';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ClusterRoleBindingPage() {
  const { t } = useI18n();

  const columns: ColumnDefinition<ClusterRoleBinding | any>[] = [
    {
      name: t('table.name'),
      render: (clusterRoleBinding) => clusterRoleBinding?.metadata?.name || clusterRoleBinding?.name,
    },
    {
      name: t('table.roleRef'),
      render: (clusterRoleBinding) => clusterRoleBinding?.roleRef?.name || clusterRoleBinding?.role || JSON.stringify(clusterRoleBinding?.roleRef),
    },
    {
      name: t('table.creationTime'),
      render: (clusterRoleBinding) => clusterRoleBinding?.metadata?.creationTimestamp || clusterRoleBinding?.creationTimestamp,
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

  const { data, mutate } = useListClusterRoleBindings(params);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleSubmit = async (_: any, record: ClusterRoleBinding) => {
    await createClusterRoleBinding(record);
    mutate();
  };

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ClusterRoleBinding) => {
    try {
      const resp = await getClusterRoleBinding(row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => setYamlDialogOpen(false);

  const handleDeleteClick = (_: any, row: ClusterRoleBinding) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.clusterRoleBinding'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRoleBinding(row?.metadata?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }

      },
      onCancel: () => { },
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
        <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
          <TableCard
            title={t('common.clusterRoleBinding')}
            addButtonLabel={t('actions.add') + ' ' + t('common.clusterRoleBinding')}
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleQueryClick}
            onViewOptionsClick={() => alert('View options button clicked')}
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
        <AddClusterRoleBindingDialog
          open={addDialogOpen}
          onClose={handleAddDialogClose}
        />
        <YAMLViewerDialog
          open={yamlDialogOpen}
          onClose={handleYamlDialogClose}
          content={currentYamlContent}
        />
        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
