'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination, FormControl, Select, InputLabel } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createServiceAccount, deleteServiceAccount, getServiceAccount, useListServiceAccounts } from '@/api/serviceAccount';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ConciseServiceAccount, ServiceAccount } from '@/types/serviceAccount';
import AddServiceAccountDialog from '@/component/Form/AddServiceAccountDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function ServiceAccountPage() {
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    filter: [
      name ? `name:${name}` : undefined,
    ].filter(Boolean).join(','),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListServiceAccounts(params);

  const columns: ColumnDefinition<ConciseServiceAccount>[] = [
    {
      name: t('table.namespace'),
      render: (account) => account?.namespace,
    },
    {
      name: t('table.name'),
      render: (account) => account?.name,
    },
    {
      name: t('table.secrets'),
      render: (account: ConciseServiceAccount) => {
        return account?.secrets?.join(', ') || '-';
      },
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
  }, [params, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleYamlClick = async (_: any, row: ConciseServiceAccount) => {
    try {
      const resp = await getServiceAccount(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseServiceAccount) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.serviceAccount')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteServiceAccount(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddServiceAccount = async (record: ServiceAccount) => {
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
          onQueryClick={() => mutate()}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.yaml')}
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
                  onChange={(e) => setOrder(e.target.value || '')}
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
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
      <AddServiceAccountDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onCreated={() => setAddDialogOpen(false)}
        onSubmit={handleAddServiceAccount}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
