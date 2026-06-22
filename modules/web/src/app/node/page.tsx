'use client';

import React, { useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { NodeDetailDialog } from '@/component/Dialog/NodeDetailDialog';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { deleteNode, getNode, useListNodes } from '@/api/node';
import { Node, ConciseNode } from '@/types/node';
import AddNodeDialog from '@/component/Form/AddNodeDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatRelativeTime, formatStatus, formatDateTime } from '@/helper/localization';

export default function NodePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<'name' | 'creationTimestamp' | '' | string>('');
  const [order, setOrder] = useState<'asc' | 'desc' | '' | string>('');
  const [status, setStatus] = useState<string>('');
  const [name, setName] = useState<string>('');
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [open, setOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [
      status ? `status:${status}` : undefined,
      name ? `name:${name}` : undefined,
    ].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, status, name]);
  const { data, mutate, isLoading } = useListNodes(params);

  const columns: ColumnDefinition<ConciseNode>[] = [{
    key: 'name',
    name: `${t('table.name')}/${t('table.id')}`,
    sortable: true,
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ color: 'rgb(47, 84, 235)', fontWeight: 500 }}>
          {node?.name || '-'}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {node?.uid || '-'}
        </Box>
      </Box>
    )
  }, {
    name: t('table.status'),
    render: (node) => {
      return formatStatus(node?.status, currentLanguage);
    },
  }, {
    name: t('table.hostname'),
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box>
          {node?.hostname || '-'}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {node?.internalIP || '-'}
        </Box>
      </Box>
    )
  }, {
    key: 'creationTimestamp',
    name: t('table.creationTime'),
    sortable: true,
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {formatDateTime(node?.creationTimestamp, currentLanguage)}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {formatRelativeTime(node?.creationTimestamp, currentLanguage)}
        </Box>
      </Box>
    )
  }, {
    name: t('table.version'),
    render: (node) => node?.kubeletVersion || '-'
  }, {
    name: t('table.actions'),
    renderOperation: true
  }];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  }

  const handleDetailClick = async (_: any, node: ConciseNode) => {
    try {
      const resp = await getNode(node?.name || '');
      setSelectedNode(resp?.data);
      setDetailDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDelete = (_: any, row: ConciseNode) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.node')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNode(row?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
    })
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.node')}
          addButtonLabel={`${t('actions.add')} ${t('common.node')}`}
          columns={columns}
          data={data?.items}
          onAddClick={() => setOpen(true)}
          onRefreshClick={() => { mutate() }}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
          specialHandling={true}
          pagination={{
            current: data?.page || 1,
            pageSize: data?.pageSize || 10,
            total: data?.total || 0,
          }}
          onPaginationChange={handlePaginationChange}
          loading={isLoading}
          sort={{
            field: sort,
            direction: order as 'asc' | 'desc',
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <FormControl>
                <InputLabel shrink>{t('table.status')}</InputLabel>
                <Select
                  size='small'
                  label={t('table.status')}
                  value={status || ''}
                  onChange={(e) => setStatus(e.target.value || '')}
                  sx={{ minWidth: 120 }}
                  displayEmpty
                >
                  <MenuItem value=''>{t('status.all')}</MenuItem>
                  <MenuItem value='Ready'>{t('status.ready')}</MenuItem>
                  <MenuItem value='NotReady'>{t('status.notReady')}</MenuItem>
                </Select>
              </FormControl>
              <TextField size='small' label={t('table.name')} value={name || ''} onChange={(e) => setName(e.target.value || '')} placeholder={t('table.textWildcardHelp')} />
            </>
          )}
        />
      </Box>
      <AddNodeDialog
        open={open}
        onClose={() => setOpen(false)}
      />
      <NodeDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        data={selectedNode}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
