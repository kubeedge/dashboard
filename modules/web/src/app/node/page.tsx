'use client';

import React, { useState } from 'react';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
import { NodeDetailDialog } from '@/components/Dialog/NodeDetailDialog';
import {
  Box,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { deleteNode, getNode, useListNodes } from '@/api/node';
import { Editor } from '@tinymce/tinymce-react';
import { Node } from '@/types/node';
import { getNodeStatus } from '@/helper/status';
import AddNodeDialog from '@/components/Form/AddNodeDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Node>[] = [{
  name: 'Name/ID',
  render: (node) => (<div>
    <div style={{ color: 'rgb(47, 84, 235)', marginBottom: '2px' }}>
      {node?.metadata?.name}
    </div>
    <div>{node?.metadata?.uid}</div>
  </div>)
}, {
  name: 'Status',
  render: (node) => getNodeStatus(node),
}, {
  name: 'Hostname/IP',
  render: (node) => (<div>
    <div>{node.status?.addresses?.find(address => address.type === 'Hostname')?.address}</div>
    <div>{node.status?.addresses?.find(address => address.type === 'InternalIP')?.address}</div>
  </div>)
}, {
  name: 'Creation time',
  render: (node) => node.metadata?.creationTimestamp
}, {
  name: 'Edge side software version',
  render: (node) => node.status?.nodeInfo?.kubeletVersion
}, {
  name: 'Operation',
  renderOperation: true
}]

export default function NodePage() {
  const { data, mutate } = useListNodes();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

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
      Error(error?.response?.data?.message || error?.message || 'Failed to get Node');
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
          Error(error?.response?.data?.message || error?.message || 'Failed to delete Node');
        }
      },
      onCancel: () => {},
    })
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
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
        />
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
