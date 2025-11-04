'use client';

import React, { useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { NodeDetailDialog } from '@/component/Dialog/NodeDetailDialog';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Pagination,
} from '@mui/material';
import { deleteNode, getNode, useListNodes } from '@/api/node';
import { Editor } from '@tinymce/tinymce-react';
import { Node } from '@/types/node';
import { getNodeStatus } from '@/helper/status';
import AddNodeDialog from '@/component/Form/AddNodeDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatRelativeTime, formatStatus, formatDateTime } from '@/helper/localization';

export default function NodePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  // No mock controls in PR branch
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

  const { data, mutate } = useListNodes(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const columns: ColumnDefinition<Node>[] = [{
    name: t('table.name') + '/ID',
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ color: 'rgb(47, 84, 235)', fontWeight: 500 }}>
          {node?.metadata?.name || '-'}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {node?.metadata?.uid || '-'}
        </Box>
      </Box>
    )
  }, {
    name: t('table.status'),
    render: (node) => {
      const status = getNodeStatus(node);
      return formatStatus(status, currentLanguage);
    },
  }, {
    name: t('table.hostname'),
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box>
          {node.status?.addresses?.find(address => address.type === 'Hostname')?.address || '-'}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {node.status?.addresses?.find(address => address.type === 'InternalIP')?.address || '-'}
        </Box>
      </Box>
    )
  }, {
    name: t('table.creationTime'),
    render: (node) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {formatDateTime(node.metadata?.creationTimestamp, currentLanguage)}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {formatRelativeTime(node.metadata?.creationTimestamp, currentLanguage)}
        </Box>
      </Box>
    )
  }, {
    name: t('table.version'),
    render: (node) => node.status?.nodeInfo?.kubeletVersion || '-'
  }, {
    name: t('table.actions'),
    renderOperation: true
  }];

  const [open, setOpen] = useState(false);

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | undefined>(undefined);

  const handleDetailClick = async (_: any, node: Node) => {
    try {
      const resp = await getNode(node?.metadata?.name || '');
      setSelectedNode(resp?.data);
      setDetailDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || 'Failed to get Node');
    }
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedNode(undefined);
  };

  const handleDelete = (_: any, row: Node) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.node'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNode(row?.metadata?.name || '');
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
          title={t('common.node')}
          addButtonLabel={t('actions.add') + ' ' + t('common.node')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => { mutate() }}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel={t('actions.view')}
          deleteButtonLabel={t('actions.delete')}
          specialHandling={true}
          noPagination
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
          <TextField size="small" select label="Status" value={status||''} onChange={(e) => setStatus(e.target.value||undefined)} sx={{ minWidth: 120 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
            <MenuItem value="NotReady">NotReady</MenuItem>
          </TextField>
          <TextField size="small" label="Name" value={name||''} onChange={(e) => setName(e.target.value||undefined)} placeholder="supports * wildcards" />
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
      <AddNodeDialog
        open={open}
        onClose={handleClose}
      />
      <NodeDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailDialogClose}
        data={selectedNode}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
