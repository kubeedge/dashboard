'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { createRuleEndpoint, deleteRuleEndpoint, getRuleEndpoint, useListRuleEndpoints } from '@/api/ruleEndpoint';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { RuleEndpoint } from '@/types/ruleEndpoint';
import AddRuleEndpointDialog from '@/component/Form/AddRuleEndpointDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';

export default function RuleEndpointPage() {
  const { namespace } = useNamespace();
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

  const { data, mutate } = useListRuleEndpoints(params);
  const { t } = useI18n();

  const columns: ColumnDefinition<RuleEndpoint | any>[] = [
    {
      name: t('table.namespace'),
      render: (ruleEndpoint) => ruleEndpoint?.metadata?.namespace || ruleEndpoint?.namespace,
    },
    {
      name: t('table.name'),
      render: (ruleEndpoint) => ruleEndpoint?.metadata?.name || ruleEndpoint?.name,
    },
    {
      name: 'RuleEndpoint Type',
      render: (ruleEndpoint) => ruleEndpoint?.spec?.ruleEndpointType || ruleEndpoint?.ruleEndpointType,
    },
    {
      name: t('table.creationTime'),
      render: (ruleEndpoint) => ruleEndpoint?.metadata?.creationTimestamp || ruleEndpoint?.creationTimestamp,
    },
    {
      name: t('table.operation'),
      renderOperation: true,
    },
  ];

  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error, success } = useAlert();

  useEffect(() => {
    mutate();
  }, [params, mutate]);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleFormSubmit = async (_: any, record: RuleEndpoint) => {
    await createRuleEndpoint(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleYamlClick = async (_: any, row: RuleEndpoint) => {
    try {
      const resp = await getRuleEndpoint(row?.metadata?.namespace || '', row?.metadata?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleYamlDialogClose = () => {
    setYamlDialogOpen(false);
  };

  const handleDeleteClick = (_: any, row: RuleEndpoint) => {
    showConfirmDialog({
      title: t('actions.delete') + ' ' + t('common.ruleEndpoint'),
      content: t('messages.deleteConfirm') + ` ${row?.metadata?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRuleEndpoint(row?.metadata?.namespace || '', row?.metadata?.name || '');
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
          title={t('common.ruleEndpoint')}
          addButtonLabel={t('actions.add') + ' ' + t('common.ruleEndpoint')}
          columns={columns}
          data={data?.items}
          onAddClick={handleAddClick}
          onRefreshClick={() => mutate()}
          onViewOptionsClick={() => alert('View options button clicked')}
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
            <MenuItem value="ruleEndpointType">RuleEndpoint Type</MenuItem>
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
      <AddRuleEndpointDialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        onSubmit={handleFormSubmit}
      />
      <YAMLViewerDialog open={yamlDialogOpen} onClose={handleYamlDialogClose} content={currentYamlContent} />
      {ConfirmDialogComponent}
    </Box>
  );
}
