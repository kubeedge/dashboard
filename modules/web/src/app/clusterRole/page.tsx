'use client';

import React, { useState, useMemo } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createClusterRole, deleteClusterRole, getClusterRole, useListClusterRoles } from '@/api/clusterRole';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddClusterRoleDialog from '@/component/Form/AddClusterRoleDialog';
import { ClusterRole, ConciseClusterRole } from '@/types/clusterRole';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function ClusterRolesPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = useState(false);
  const [currentYamlContent, setCurrentYamlContent] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
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
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListClusterRoles(params);

  const columns: ColumnDefinition<ConciseClusterRole>[] = [
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (role) => role?.name || role?.name,
    },
    {
      name: t('table.labels'),
      render: (role) => (
        <Box>
          {role?.labels && Object.entries(role.labels).map(([key, value]) => (
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
      render: (role) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(role?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(role?.creationTimestamp, currentLanguage)}
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

  const handleYamlClick = async (_: any, row: ConciseClusterRole) => {
    try {
      const resp = await getClusterRole(row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleSubmit = async (record: ClusterRole) => {
    await createClusterRole(record);
    mutate();
  }

  const handleDeleteClick = (_: any, row: ConciseClusterRole) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.clusterRole')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRole(row?.name || '');
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
          onAddClick={() => setAddDialogOpen(true)}
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
      <AddClusterRoleDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleSubmit}
        onCreated={() => setAddDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
