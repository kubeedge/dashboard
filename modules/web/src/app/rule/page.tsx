'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ColumnDefinition, TableCard } from '@/component/TableCard';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { createRule, deleteRule, getRule, useListRules } from '@/api/rule';
import AddRuleDialog from '@/component/AddRuleDialog';
import YAMLViewerDialog from '@/component/YAMLViewerDialog';
import { Rule } from '@/types/rule';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';

const columns: ColumnDefinition<Rule | any>[] = [
  {
    name: 'Namespace',
    render: (rule) => rule?.metadata?.namespace || rule?.namespace,
  },
  {
    name: 'Name',
    render: (rule) => rule?.metadata?.name || rule?.name,
  },
  {
    name: 'Source',
    render: (rule) => rule?.spec?.source || rule?.source,
  },
  {
    name: 'SourceResource',
    render: (rule) => rule?.spec?.sourceResource?.path || rule?.sourceResource,
  },
  {
    name: 'Target',
    render: (rule) => rule?.spec?.target || rule?.target,
  },
  {
    name: 'TargetResource',
    render: (rule) => rule?.spec?.targetResource?.path || rule?.targetResource,
  },
  {
    name: 'Creation time',
    render: (rule) => rule.metadata?.creationTimestamp || rule?.creationTimestamp,
  },
  {
    name: 'Operation',
    renderOperation: true,
  },
];

export default function RulePage() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const { namespace } = useNamespace();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { setErrorMessage } = useAlert();

  // New pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('asc');
  const [name, setName] = useState('');


  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    name: name ? `*${name}*` : undefined,
  }), [namespace, page, pageSize, sort, order, name]);

  const { data, mutate } = useListRules(params);

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleRefreshClick = () => {
    mutate();
  };

  const handleViewOptionsClick = () => {
    alert('View options button clicked');
  };

  const handleYamlClick = async (_: any, row: Rule) => {
    try {
      const resp = await getRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to get Rule');
    }

  }

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddRule = async (_: any, record: Rule) => {
    await createRule(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleDeleteClick = (_: any, row: Rule) => {
    showConfirmDialog({
      title: 'Delete Rule',
      content: `Are you sure to delete Rule ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (error: any) {
          setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to delete Rule');
        }
      },
      onCancel: () => {},
    })
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f1f2f5' }}>
      <Box sx={{ width: '100%', padding: '20px', minHeight: 350, backgroundColor: 'white' }}>
        <TableCard
          title="Rule"
          addButtonLabel="Add Rule"
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={handleRefreshClick}
          onViewOptionsClick={handleViewOptionsClick}
          onDetailClick={handleYamlClick}
          onDeleteClick={handleDeleteClick}
          detailButtonLabel="YAML"
          deleteButtonLabel="Delete"
          noPagination={true}
        />

        {/* New pagination controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            size="small"
            label="Rows per page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="source">Source</MenuItem>
            <MenuItem value="target">Target</MenuItem>
            <MenuItem value="creationTimestamp">Creation Time</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>

          <TextField
            size="small"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Filter by name..."
            sx={{ minWidth: 200 }}
          />



          <Pagination
            count={data?.total ? Math.ceil(data.total / pageSize) : 1}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            sx={{ ml: 'auto' }}
          />
        </Box>
      </Box>
      <AddRuleDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleAddRule}
      />
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlDialogClose}
        content={currentYamlContent}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
