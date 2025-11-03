'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createServiceAccount, deleteServiceAccount, getServiceAccount, useListServiceAccounts } from '@/api/serviceAccount';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ServiceAccount } from '@/types/serviceAccount';
import AddServiceAccountDialog from '@/component/Form/AddServiceAccountDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function ServiceAccountPage() {
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

  const { data, mutate } = useListServiceAccounts(params);
  const { t } = useI18n();

  const columns: ColumnDefinition<ServiceAccount | any>[] = [
    {
      name: t('table.namespace'),
      render: (account) => account?.metadata?.namespace || account?.namespace,
    },
    {
      name: t('table.name'),
      render: (account) => account?.metadata?.name || account?.name,
    },
    {
      name: t('table.secrets'),
      render: (account: ServiceAccount) => {
        // Handle both original and transformed data
        if (typeof account?.secrets === 'number') {
          return account.secrets;
        }
        return account?.secrets?.map(secret => secret.name)?.join(', ') || '-';
      },
    },
    {
      name: t('table.creationTime'),
      render: (account) => account?.metadata?.creationTimestamp || account?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleQueryClick = () => {
    mutate();
  };

  const handleYamlClick = async (_: any, row: ServiceAccount) => {
    try {
      const resp = await getServiceAccount(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      Error(error?.response?.data?.message || error?.message || 'Failed to get ServiceAccount');
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: ServiceAccount) => {
    showConfirmDialog({
      title: 'Delete ServiceAccount',
      content: `Are you sure to delete ServiceAccount ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteServiceAccount(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          Error(error?.response?.data?.message || error?.message || 'Failed to create ServiceAccount');
        }
      },
      onCancel: () => { },
    })
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddFormSubmit = async (_: any, record: ServiceAccount) => {
    await createServiceAccount(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.serviceAccount')}
          addButtonLabel={t('actions.add') + ' ' + t('common.serviceAccount')}
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
              <MenuItem value="namespace">Namespace</MenuItem>
              <MenuItem value="secrets">Secrets</MenuItem>
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
      <AddServiceAccountDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
