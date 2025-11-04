'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createSecret, deleteSecret, getSecret, useListSecrets } from '@/api/secret';
import { Secret } from '@/types/secret';
import { useNamespace } from '@/hook/useNamespace';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import AddSecretDialog from '@/component/Form/AddSecretDialog';
import SecretDetailDialog from '@/component/Dialog/SecretDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function SecretPage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [name, setName] = useState<string | undefined>(undefined);
  const [mock, setMock] = useState<number | undefined>(undefined);
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
    mock,
  }), [namespace, page, pageSize, sort, order, name, mock]);
  const { data, mutate } = useListSecrets(params);
  const { t } = useI18n();

  const columns: ColumnDefinition<Secret | any>[] = [
    {
      name: t('table.namespace'),
      render: (secret) => (secret as any)?.metadata?.namespace ?? (secret as any)?.namespace,
    },
    {
      name: t('table.name'),
      render: (secret) => (secret as any)?.metadata?.name ?? (secret as any)?.name,
    },
    {
      name: t('table.type'),
      render: (secret) => (secret as any)?.type ?? (secret as any)?.secretType,
    },
    {
      name: t('table.creationTime'),
      render: (secret) => (secret as any)?.metadata?.creationTimestamp ?? (secret as any)?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();
  const [addOpen, setAddOpen] = React.useState(false);

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleAddClick = async () => {
    setOpenAddDialog(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDetailClick = async (_: any, row: Secret) => {
    try {
      const resp = await getSecret(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setSelectedSecret(resp?.data);
      setOpenDetailDialog(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || 'Failed to get Secret');
    }
  };

    const handleOnSubmit = async (_: any, record: Secret) => {
    try {
      await createSecret(record?.metadata?.namespace || namespace || 'default', record);
      success('Secret created');
      setOpenAddDialog(false);
      mutate();
    } catch (e: any) {
      error(e?.response?.data?.message || e?.message || 'Failed to create Secret');
    }
  };

  const handleDeleteClick = (_: any, row: Secret) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.secret'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteSecret(row?.metadata?.namespace || '', row?.metadata?.name || '');
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
          title={t('common.secret')}
          addButtonLabel={t('actions.add') + ' ' + t('common.secret')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
          noPagination={true}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
          <TextField size="small" select label="Rows per page" value={pageSize}
            onChange={(e) => { const v = Number(e.target.value)||10; setPageSize(v); setPage(1); mutate(); }} sx={{ minWidth: 140 }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
          <TextField size="small" select label="Sort" value={sort||''} onChange={(e) => setSort(e.target.value||undefined)} sx={{ minWidth: 180 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="name">name</MenuItem>
            <MenuItem value="creationTimestamp">creationTimestamp</MenuItem>
          </TextField>
          <TextField size="small" select label="Order" value={order||''} onChange={(e) => setOrder((e.target.value as any)||undefined)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="asc">asc</MenuItem>
            <MenuItem value="desc">desc</MenuItem>
          </TextField>
          <TextField size="small" label="Name" value={name||''} onChange={(e) => setName(e.target.value||undefined)} placeholder="supports * wildcards" />
          {/* mock control removed in PR branch; automatic fetch on change, no apply button */}
          <Box sx={{ flexGrow: 1 }} />
          <Pagination
            page={page}
            onChange={(_, value) => { setPage(value); mutate(); }}
            count={Math.max(1, Math.ceil(((data?.total ?? 0) as number) / (pageSize || 1)))}
            size="small"
            color="primary"
          />
        </Box>
      </Box>
      <AddSecretDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSubmit={handleOnSubmit}  />

      <SecretDetailDialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} data={selectedSecret} />
      {ConfirmDialogComponent}
    </Box>
  );
}
