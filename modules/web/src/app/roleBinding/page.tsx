'use client';

import React, { useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, Direction, TableCard } from '@/component/Common/TableCard';
import { createRoleBinding, deleteRoleBinding, getRoleBinding, useListRoleBindings } from '@/api/roleBinding';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddRoleBindingDialog from '@/component/Form/AddRoleBindingDialog';
import { ConciseRoleBinding, RoleBinding } from '@/types/roleBinding';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function RoleBindingPage() {
  const { namespace } = useNamespace();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addRoleBindingDialogOpen, setAddRoleBindingDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<Direction | ''>('');
  const [name, setName] = useState('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    ...(name && { name }),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListRoleBindings(namespace, params);

  const columns: ColumnDefinition<ConciseRoleBinding>[] = [
    {
      name: t('table.namespace'),
      render: (roleBinding) => roleBinding?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (roleBinding) => roleBinding?.name,
    },
    {
      name: t('table.roleRef'),
      render: (roleBinding) => roleBinding?.role,
    },
    {
      name: t('table.labels'),
      render: (roleBinding) => (
        <Box>
          {roleBinding?.labels && Object.entries(roleBinding.labels).map(([key, value]) => (
            <Box
              key={key}
              sx={{
                display: 'block', bgcolor: 'grey.200', color: 'text.primary', px: 1,
                py: 0.5, borderRadius: 1, mr: 0.5, mb: 0.5, fontSize: '0.75rem'
              }}
            >
              {key}: {value}
            </Box>
          ))}
        </Box>
      )
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
      name: t('table.actions'),
      renderOperation: true,
    },
  ];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: Direction) => {
    setSort(field);
    setOrder(direction);
  }

  const handleYamlClick = async (_: any, row: ConciseRoleBinding) => {
    try {
      const resp = await getRoleBinding(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleOnSubmit = async (roleBinding: RoleBinding) => {
    await createRoleBinding(roleBinding?.metadata?.namespace || namespace || 'default', roleBinding);
    mutate();
  }

  const handleDeleteClick = (_: any, row: ConciseRoleBinding) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.roleBinding')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRoleBinding(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.roleBinding')}
          addButtonLabel={`${t('actions.add')} ${t('common.roleBinding')}`}
          columns={columns}
          data={data?.items}
          onAddClick={() => setAddRoleBindingDialogOpen(true)}
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
            direction: order as Direction,
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <TextField
                size='small'
                label={t('table.name')}
                value={name || ''}
                onChange={(e) => setName(e.target.value || '')}
                placeholder={t('table.textWildcardHelp')}
              />
            </>
          )}
        />
      </Box>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
      <AddRoleBindingDialog
        open={addRoleBindingDialogOpen}
        onClose={() => setAddRoleBindingDialogOpen(false)}
        onSubmit={handleOnSubmit}
        onCreated={() => setAddRoleBindingDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
