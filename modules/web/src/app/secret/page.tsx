'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination, FormControl, Select, InputLabel } from '@mui/material';
import { createSecret, deleteSecret, getSecret, useListSecrets } from '@/api/secret';
import { ConciseSecret, Secret } from '@/types/secret';
import { useNamespace } from '@/hook/useNamespace';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import AddSecretDialog from '@/component/Form/AddSecretDialog';
import SecretDetailDialog from '@/component/Dialog/SecretDetailDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function SecretPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const { namespace } = useNamespace();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | string>('desc');
  const [name, setName] = useState<string>('');
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListSecrets(params);

  const columns: ColumnDefinition<ConciseSecret>[] = [
    {
      name: t('table.namespace'),
      render: (secret) => secret?.namespace,
    },
    {
      name: t('table.name'),
      render: (secret) => secret?.name,
    },
    {
      name: t('table.type'),
      render: (secret) => secret?.type,
    },
    {
      name: t('table.creationTime'),
      render: (account) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(account?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(account?.creationTimestamp, currentLanguage)}
          </Box>
        </Box>
      )
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  useEffect(() => {
    mutate();
  }, [namespace, params, mutate]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleDetailClick = async (_: any, row: ConciseSecret) => {
    try {
      const resp = await getSecret(row?.namespace || '', row?.name || '');
      setSelectedSecret(resp?.data);
      setOpenDetailDialog(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleOnSubmit = async (record: Secret) => {
    await createSecret(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: ConciseSecret) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.secret'),
      content: t('messages.deleteConfirm') + ` ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteSecret(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.secret')}
          addButtonLabel={`${t('actions.add')} ${t('common.secret')}`}
          columns={columns}
          data={data?.items}
          onAddClick={() => setOpenAddDialog(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
          loading={isLoading}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.pageSize || 10,
            total: data?.total || 0,
          }}
          onPaginationChange={handlePaginationChange}
          filter={(
            <>
              <FormControl>
                <InputLabel shrink>{t('table.labelSort')}</InputLabel>
                <Select
                  size='small'
                  label={t('table.labelSort')}
                  value={sort}
                  onChange={(e) => setSort(e.target.value || '')}
                  sx={{ minWidth: 180 }}
                  displayEmpty
                >
                  <MenuItem value=''>{t('table.default')}</MenuItem>
                  <MenuItem value='name'>{t('table.name')}</MenuItem>
                  <MenuItem value='creationTimestamp'>{t('table.creationTime')}</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel shrink>{t('table.labelOrder')}</InputLabel>
                <Select
                  size='small'
                  label={t('table.labelOrder')}
                  value={order || ''}
                  onChange={(e) => setOrder(e.target.value)}
                  sx={{ minWidth: 140 }}
                  displayEmpty
                >
                  <MenuItem value=''>{t('table.default')}</MenuItem>
                  <MenuItem value='asc'>{t('table.orderAsc')}</MenuItem>
                  <MenuItem value='desc'>{t('table.orderDesc')}</MenuItem>
                </Select>
              </FormControl>
              <TextField size='small' label={t('table.name')} value={name || ''} onChange={(e) => setName(e.target.value || '')} placeholder={t('table.textWildcardHelp')} />
            </>
          )}
        />
      </Box>
      <AddSecretDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleOnSubmit}
        onCreated={() => setOpenAddDialog(false)}
      />
      <SecretDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        data={selectedSecret}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
