// src/pages/NodePage.js
'use client';

import React, { useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { NodeDetailDialog } from '@/component/NodeDetailDialog';
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
import AddNodeDialog from '@/component/AddNodeDialog';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function NodePage() {
  const { data, mutate } = useListNodes();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();
  const { t } = useI18n();

  const columns: ColumnDefinition<Node>[] = [{
    name: t('table.name') + '/ID',
    render: (node) => (<div>
      <div style={{ color: 'rgb(47, 84, 235)', marginBottom: '2px' }}>
        {node?.metadata?.name}
      </div>
      <div>{node?.metadata?.uid}</div>
    </div>)
  }, {
    name: t('table.status'),
    render: (node) => getNodeStatus(node),
  }, {
    name: t('table.hostname'),
    render: (node) => (<div>
      <div>{node.status?.addresses?.find(address => address.type === 'Hostname')?.address}</div>
      <div>{node.status?.addresses?.find(address => address.type === 'InternalIP')?.address}</div>
    </div>)
  }, {
    name: t('table.age'),
    render: (node) => node.metadata?.creationTimestamp
  }, {
    name: t('table.version'),
    render: (node) => node.status?.nodeInfo?.kubeletVersion
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
      title: t('actions.delete') + ' ' + t('common.node'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNode(row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
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
