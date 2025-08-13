// src/pages/NodePage.js
'use client';

import React, { useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { NodeDetailDialog } from '@/component/NodeDetailDialog';
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
import AddNodeDialog from '@/component/AddNodeDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<any>[] = [{
  name: 'Name/ID',
  render: (node) => (<div>
    <div style={{ color: 'rgb(47, 84, 235)', marginBottom: '2px' }}>
      {node?.metadata?.name ?? node?.name}
    </div>
    <div>{node?.metadata?.uid ?? node?.uid}</div>
  </div>)
}, {
  name: 'Status',
  render: (node) => (node?.status?.conditions ? getNodeStatus(node as Node) : (node?.status ?? '')),
}, {
  name: 'Hostname/IP',
  render: (node) => (<div>
    <div>{node.status?.addresses?.find((address: any) => address.type === 'Hostname')?.address ?? node?.hostname}</div>
    <div>{node.status?.addresses?.find((address: any) => address.type === 'InternalIP')?.address ?? node?.internalIP}</div>
  </div>)
}, {
  name: 'Creation time',
  render: (node) => node.metadata?.creationTimestamp ?? node?.creationTimestamp
}, {
  name: 'Edge side software version',
  render: (node) => node.status?.nodeInfo?.kubeletVersion ?? node?.kubeletVersion
}, {
  name: 'Operation',
  renderOperation: true
}]

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
  const { setErrorMessage } = useAlert();

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
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Node');
    }
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedNode(undefined);
  };

  const handleDelete = (_: any, row: Node) => {
    showConfirmDialog({
      title: 'Delete Node',
      content: `Are you sure to delete Node ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNode(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Node');
        }
      },
      onCancel: () => {},
    })
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Nodes"
          addButtonLabel="Add Node"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => {mutate()}}
          onDetailClick={handleDetailClick}
          onDeleteClick={handleDelete}
          detailButtonLabel="Details"
          deleteButtonLabel="Delete"
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
          <Button variant="outlined" onClick={() => mutate()}>Apply</Button>
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
