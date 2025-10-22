'use client';

import React, { useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createNodeGroup, deleteNodeGroup, getNodeGroup, useListNodeGroups } from '@/api/nodeGroup';
import { TextField, MenuItem, Button, Pagination } from '@mui/material';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddNodeGroupDialog from '@/component/AddNodeGroupDialog';
import type { NodeGroup } from '@/types/nodeGroup';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

// Compatible with full NodeGroup object and lightweight DTO from server
const columns: ColumnDefinition<any>[] = [
  {
    name: 'Name',
    render: (row: any) => row?.metadata?.name ?? row?.name,
  },
  {
    name: 'Creation time',
    render: (row: any) => row?.metadata?.creationTimestamp ?? row?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];


export default function NodeGroupPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState<string | undefined>('creationTimestamp');
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('desc');
  const [namespace, setNamespace] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);
  // No mock controls in PR branch
  const params = useMemo(() => ({
    page, pageSize, sort, order,
    filter: [
      namespace ? `namespace:${namespace}` : undefined,
      name ? `name:${name}` : undefined,
    ].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, namespace, name]);
  const [selectedYaml, setSelectedYaml] = React.useState<NodeGroup | null>(null);
  const [openYamlDialog, setOpenYamlDialog] = React.useState(false);
  const [openAddNodeGroupDialog, setOpenAddNodeGroupDialog] = React.useState(false);
  const { data, mutate } = useListNodeGroups(params);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  const handleAddClick = () => {
    setOpenAddNodeGroupDialog(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleDetailClick = async (_: any, row: any) => {
    try {
      const resp = await getNodeGroup((row?.metadata?.name ?? row?.name) || '');
      setSelectedYaml(resp?.data);
      setOpenYamlDialog(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get NodeGroup');
    }
  };

  const handleDeleteClick = async (_: any, row: any) => {
    showConfirmDialog({
      title: 'Delete NodeGroup',
      content: `Are you sure to delete NodeGroup ${(row?.metadata?.name ?? row?.name) || ''}?`,
      onConfirm: async () => {
        try {
          await deleteNodeGroup((row?.metadata?.name ?? row?.name) || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete NodeGroup');
        }

      },
      onCancel: () => {},
    })
  };

  const handleCloseYamlDialog = () => {
    setOpenYamlDialog(false);
  };

  const handleCloseAddNodeGroupDialog = () => {
    setOpenAddNodeGroupDialog(false);
  };

  const handleAddNodeGroup = async (_: any, record: NodeGroup) => {
    await createNodeGroup(record);
    mutate();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
        <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
          <TableCard
            title="Node Group"
            addButtonLabel="Add NodeGroup"
            columns={columns}
            data={data?.items}
            onAddClick={handleAddClick}
            onRefreshClick={handleRefreshClick}
            onDetailClick={handleDetailClick}
            onDeleteClick={handleDeleteClick}
            detailButtonLabel="YAML"
            deleteButtonLabel="Delete"
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
            <TextField size="small" label="Namespace" value={namespace||''} onChange={(e) => setNamespace(e.target.value||undefined)} />
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
        <YAMLViewerDialog
          open={openYamlDialog}
          onClose={handleCloseYamlDialog}
          content={selectedYaml}
        />
        <AddNodeGroupDialog
          open={openAddNodeGroupDialog}
          onClose={handleCloseAddNodeGroupDialog}
          onSubmit={handleAddNodeGroup}
        />
        {ConfirmDialogComponent}
      </Box>
    </LocalizationProvider>
  );
}
