'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createRule, deleteRule, getRule, useListRules } from '@/api/rule';
import AddRuleDialog from '@/component/Form/AddRuleDialog';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { Rule } from '@/types/rule';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';



export default function RulePage() {
  const { t } = useI18n();

  const columns: ColumnDefinition<Rule | any>[] = [
    {
      name: t('table.namespace'),
      render: (rule) => rule?.metadata?.namespace || rule?.namespace,
    },
    {
      name: t('table.name'),
      render: (rule) => rule?.metadata?.name || rule?.name,
    },
    {
      name: t('table.source'),
      render: (rule) => rule?.spec?.source || rule?.source,
    },
    {
      name: t('table.sourceResource'),
      render: (rule) => rule?.spec?.sourceResource?.path || rule?.sourceResource,
    },
    {
      name: t('table.target'),
      render: (rule) => rule?.spec?.target || rule?.target,
    },
    {
      name: t('table.targetResource'),
      render: (rule) => rule?.spec?.targetResource?.path || rule?.targetResource,
    },
    {
      name: t('table.creationTime'),
      render: (rule) => rule.metadata?.creationTimestamp || rule?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const { namespace } = useNamespace();
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

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
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
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
      title: t('actions.delete') + ' ' + t('common.rule'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRule(row?.metadata?.namespace || '', row?.metadata?.name || '');
          mutate();
        } catch (err: any) {
          error(err?.response?.data?.message || err?.message || t('messages.error'));
        }
      },
      onCancel: () => { },
    })
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.rule')}
          addButtonLabel={t('actions.add') + ' ' + t('common.rule')}
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
