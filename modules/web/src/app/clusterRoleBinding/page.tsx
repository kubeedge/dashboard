'use client';

import React, { useState, useMemo } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import {
  createClusterRoleBinding, deleteClusterRoleBinding, getClusterRoleBinding, useListClusterRoleBindings
} from '@/api/clusterRoleBinding';
import AddClusterRoleBindingDialog from '@/component/Form/AddClusterRoleBindingDialog';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ClusterRoleBinding, ConciseClusterRoleBinding } from '@/types/clusterRoleBinding';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function ClusterRoleBindingPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
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
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListClusterRoleBindings(params);

  const columns: ColumnDefinition<ConciseClusterRoleBinding>[] = [
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (clusterRoleBinding) => clusterRoleBinding?.name,
    },
    {
      name: t('table.roleRef'),
      render: (clusterRoleBinding) => clusterRoleBinding?.role,
    },
    {
      name: t('table.labels'),
      render: (clusterRoleBinding) => (
        <Box>
          {clusterRoleBinding?.labels && Object.entries(clusterRoleBinding.labels).map(([key, value]) => (
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
      render: (clusterRoleBinding) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(clusterRoleBinding?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(clusterRoleBinding?.creationTimestamp, currentLanguage)}
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

  const handleSubmit = async (record: ClusterRoleBinding) => {
    await createClusterRoleBinding(record);
    mutate();
  };

  const handleYamlClick = async (_: any, row: ConciseClusterRoleBinding) => {
    try {
      const resp = await getClusterRoleBinding(row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseClusterRoleBinding) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.clusterRoleBinding')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteClusterRoleBinding(row?.name || '');
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
          title={t('common.clusterRoleBinding')}
          addButtonLabel={t('actions.add') + ' ' + t('common.clusterRoleBinding')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setAddDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onViewOptionsClick={() => alert('View options button clicked')}
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
      <AddClusterRoleBindingDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleSubmit}
        onCreated={() => setAddDialogOpen(false)}
      />
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
