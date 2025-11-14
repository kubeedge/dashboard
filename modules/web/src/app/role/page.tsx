'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createRole, deleteRole, getRole, useListRoles } from '@/api/role';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddRoleDialog from '@/component/Form/AddRoleDialog';
import { ConciseRole, Role } from '@/types/role';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function RolePage() {
  const { namespace } = useNamespace();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    ...(name && { 'name': `*${name}*` }),
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListRoles(namespace, params);

  const columns: ColumnDefinition<ConciseRole>[] = [
    {
      name: t('table.namespace'),
      render: (role) => role?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (role) => role?.name,
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (secret) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(secret?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(secret?.creationTimestamp, currentLanguage)}
          </Box>
        </Box>
      )
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  }

  const handleYamlClick = async (_: any, row: ConciseRole) => {
    try {
      const resp = await getRole(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseRole) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.role'),
      content: t('messages.deleteConfirm') + ` ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRole(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  const handleOnSubmit = async (record: Role) => {
    await createRole(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.role')}
          addButtonLabel={t('actions.add') + ' ' + t('common.role')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setAddRoleDialogOpen(true)}
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
          sort={{
            field: sort,
            direction: order as 'asc' | 'desc',
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
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
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={() => setAddRoleDialogOpen(false)}
        onSubmit={handleOnSubmit}
        onCreated={() => setAddRoleDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
