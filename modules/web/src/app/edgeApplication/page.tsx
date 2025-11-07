'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, Button, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createEdgeApplication, deleteEdgeApplication, getEdgeApplication, useListEdgeApplications } from '@/api/edgeApplication';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddEdgeApplicationDialog from '@/component/Form/AddEdgeApplicationDialog';
import { EdgeApplication } from '@/types/edgeApplication';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function EdgeApplicationPage() {
  const [name, setName] = useState('');
  const { namespace } = useNamespace();
  const { t } = useI18n();

  const columns: ColumnDefinition<EdgeApplication>[] = [
    {
      name: t('table.namespace'),
      render: (edgeApplication) => edgeApplication?.metadata?.namespace,
    },
    {
      name: t('table.name'),
      render: (edgeApplication) => edgeApplication?.metadata?.name,
    },
    {
      name: t('table.nodeGroups'),
      render: (edgeApplication) => edgeApplication?.spec?.workloadScope?.targetNodeGroups?.map(group => group.name).join(', '),
    },
    {
      name: t('table.creationTime'),
      render: (edgeApplication) => edgeApplication.metadata?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
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
  const { data, mutate } = useListEdgeApplications(params);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  useEffect(() => {
    mutate();
  }, [namespace, mutate]);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleViewOptionsClick = () => {
    alert('View options button clicked');
  };

  const handleYamlClick = async (_: any, row: EdgeApplication) => {
    try {
      const resp = await getEdgeApplication(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddEdgeApplication = async (_: any, record: EdgeApplication) => {
    await createEdgeApplication(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: EdgeApplication) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.edgeApplication'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteEdgeApplication(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
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
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onViewOptionsClick={handleViewOptionsClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel={t('actions.delete')}
          noPagination={true}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', marginTop: 2, flexWrap: 'wrap' }}>
          <TextField size="small" select label="Rows per page" value={pageSize}
            onChange={(e) => { const v = Number(e.target.value) || 10; setPageSize(v); setPage(1); mutate(); }} sx={{ minWidth: 140 }}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
          <TextField size="small" select label="Sort" value={sort || ''} onChange={(e) => setSort(e.target.value || undefined)} sx={{ minWidth: 180 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="name">name</MenuItem>
            <MenuItem value="creationTimestamp">creationTimestamp</MenuItem>
          </TextField>
          <TextField size="small" select label="Order" value={order || ''} onChange={(e) => setOrder((e.target.value as any) || undefined)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="asc">asc</MenuItem>
            <MenuItem value="desc">desc</MenuItem>
          </TextField>
          <TextField size="small" label="Name" value={name || ''} onChange={(e) => setName(e.target.value)} placeholder="supports * wildcards" />
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
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      <AddEdgeApplicationDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
