'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, Button, MenuItem, Pagination } from '@mui/material';
import { createEdgeApplication, deleteEdgeApplication, getEdgeApplication, useListEdgeApplications } from '@/api/edgeApplication';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import AddEdgeApplicationDialog from '@/component/AddEdgeApplicationDialog';
import { EdgeApplication } from '@/types/edgeApplication';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<EdgeApplication | any>[] = [
  {
    name: 'Namespace',
    render: (edgeApplication) => (edgeApplication as any)?.metadata?.namespace ?? (edgeApplication as any)?.namespace,
  },
  {
    name: 'Name',
    render: (edgeApplication) => (edgeApplication as any)?.metadata?.name ?? (edgeApplication as any)?.name,
  },
  {
    name: 'NodeGroups',
    render: (edgeApplication) => (edgeApplication as any)?.spec?.workloadScope?.targetNodeGroups?.map((group: any) => group.name).join(', ') ?? '',
  },
  {
    name: 'Creation time',
    render: (edgeApplication) => (edgeApplication as any)?.metadata?.creationTimestamp ?? (edgeApplication as any)?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function EdgeApplicationPage() {
  const [name, setName] = useState('');
  const { namespace } = useNamespace();
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
  const { setErrorMessage } = useAlert();

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
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get EdgeApplication');
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
      title: 'Delete EdgeApplication',
      content: `Are you sure to delete EdgeApplication ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteEdgeApplication(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.message || error?.message || 'Failed to delete EdgeApplication');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="EdgeApplication"
          addButtonLabel="Add EdgeApplication"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onViewOptionsClick={handleViewOptionsClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
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
          <TextField size="small" label="Name" value={name||''} onChange={(e) => setName(e.target.value)} placeholder="supports * wildcards" />
          {/* mock control removed in PR branch */}
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
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      <AddEdgeApplicationDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleAddEdgeApplication}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
