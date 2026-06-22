'use client';

import React, { useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, Direction, TableCard } from '@/component/Common/TableCard';
import { createEdgeApplication, deleteEdgeApplication, getEdgeApplication, useListEdgeApplications } from '@/api/edgeApplication';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddEdgeApplicationDialog from '@/component/Form/AddEdgeApplicationDialog';
import { ConciseEdgeApplication, EdgeApplication } from '@/types/edgeApplication';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function EdgeApplicationPage() {
  const [name, setName] = useState('');
  const { namespace } = useNamespace();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<Direction | ''>('');
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListEdgeApplications(namespace, params);

  const columns: ColumnDefinition<ConciseEdgeApplication>[] = [
    {
      name: t('table.namespace'),
      render: (edgeApplication) => edgeApplication?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (edgeApplication) => edgeApplication?.name,
    },
    {
      name: t('table.nodeGroups'),
      render: (edgeApplication) => edgeApplication?.nodeGroups || '-',
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (edgeApplication) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(edgeApplication?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(edgeApplication?.creationTimestamp, currentLanguage)}
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

  const handleSortChange = (field: string, direction: Direction) => {
    setSort(field);
    setOrder(direction);
  }

  const handleYamlClick = async (_: any, row: ConciseEdgeApplication) => {
    try {
      const resp = await getEdgeApplication(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleAddEdgeApplication = async (record: EdgeApplication) => {
    await createEdgeApplication(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: ConciseEdgeApplication) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.edgeApplication')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteEdgeApplication(row?.namespace || '', row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.message || err?.message || t('messages.error'));
        }
      },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.edgeApplication')}
          addButtonLabel={t('actions.add') + ' ' + t('common.edgeApplication')}
          columns={columns}
          data={data?.items}
          onAddClick={() => setAddDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel={t('actions.detail')}
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
      <AddEdgeApplicationDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddEdgeApplication}
        onCreated={() => setAddDialogOpen(false)}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
