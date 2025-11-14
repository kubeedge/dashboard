'use client';

import React, { useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { deleteNodeGroup, getNodeGroup, useListNodeGroups, createNodeGroup } from '@/api/nodeGroup';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import AddNodeGroupDialog from '@/component/Form/AddNodeGroupDialog';
import type { ConciseNodeGroup, NodeGroup } from '@/types/nodeGroup';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function NodeGroupPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc' | string>('');
  const [name, setName] = useState<string>('');
  const [selectedYaml, setSelectedYaml] = React.useState<NodeGroup | null>(null);
  const [openYamlDialog, setOpenYamlDialog] = React.useState(false);
  const [openAddNodeGroupDialog, setOpenAddNodeGroupDialog] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const params = useMemo(() => ({
    page, pageSize, sort, order,
    filter: [
      name ? `name:${name}` : undefined,
    ].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListNodeGroups(params);

  const columns: ColumnDefinition<ConciseNodeGroup>[] = [
    {
      key: 'name',
      name: t('table.name'),
      sortable : true,
      render: (row) => row?.name || '-',
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable : true,
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

  const handleAddNodeGroup = async (record: NodeGroup) => {
    await createNodeGroup(record);
    mutate();
  };

  const handleDetailClick = async (_: any, row: any) => {
    try {
      const resp = await getNodeGroup((row?.metadata?.name ?? row?.name) || '');
      setSelectedYaml(resp?.data);
      setOpenYamlDialog(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = async (_: any, row: any) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.nodeGroup'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name ?? row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteNodeGroup((row?.metadata?.name ?? row?.name) || '');
          mutate();
        } catch (e: any) {
          error(e?.response?.data?.message || e?.message || t('messages.error'));
        }
      },
    });
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.nodeGroup')}
          addButtonLabel={`${t('actions.add')} ${t('common.nodeGroup')}`}
          columns={columns}
          data={data?.items}
          onAddClick={() => setOpenAddNodeGroupDialog(true)}
          onRefreshClick={() => mutate()}
          onDetailClick={handleDetailClick}
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
              <TextField
                size="small"
                label={t('table.name')}
                value={name || ''}
                onChange={(e) => setName(e.target.value || '')}
                placeholder={t('table.textWildcardHelp')}
              />
            </>
          )}
        />
      </Box>
      <YAMLViewerDialog open={openYamlDialog} onClose={() => setOpenYamlDialog(false)} content={selectedYaml} />
      <AddNodeGroupDialog
        open={openAddNodeGroupDialog}
        onClose={() => setOpenAddNodeGroupDialog(false)}
        onCreated={() => setOpenAddNodeGroupDialog(false)}
        onSubmit={handleAddNodeGroup}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
