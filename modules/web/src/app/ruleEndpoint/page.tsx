'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, MenuItem, Pagination } from '@mui/material';
import { ColumnDefinition, Direction, TableCard } from '@/component/Common/TableCard';
import { createRuleEndpoint, deleteRuleEndpoint, getRuleEndpoint, useListRuleEndpoints } from '@/api/ruleEndpoint';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ConciseRuleEndpoint, RuleEndpoint } from '@/types/ruleEndpoint';
import AddRuleEndpointDialog from '@/component/Form/AddRuleEndpointDialog';
import { useNamespace } from '@/hook/useNamespace';
import useConfirmDialog from '@/hook/useConfirmDialog';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function RuleEndpointPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const { showConfirmDialog, ConfirmDialogComponent } = useConfirmDialog();
  const { error } = useAlert();
  const { namespace } = useNamespace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<Direction | string>('');
  const [name, setName] = useState('');
  const params = useMemo(() => ({
    namespace,
    page,
    pageSize,
    sort,
    order,
    name: name ? `*${name}*` : undefined,
  }), [namespace, page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListRuleEndpoints(namespace, params);

  const columns: ColumnDefinition<ConciseRuleEndpoint>[] = [
    {
      name: t('table.namespace'),
      render: (ruleEndpoint) => ruleEndpoint?.namespace,
    },
    {
      key: 'name',
      name: t('table.name'),
      sortable: true,
      render: (ruleEndpoint) => ruleEndpoint?.name,
    },
    {
      name: t('table.ruleEndpointType'),
      render: (ruleEndpoint) => ruleEndpoint?.ruleEndpointType,
    },
    {
      key: 'creationTimestamp',
      name: t('table.creationTime'),
      sortable: true,
      render: (ruleEndpoint) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {formatDateTime(ruleEndpoint?.creationTimestamp, currentLanguage)}
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            {formatRelativeTime(ruleEndpoint?.creationTimestamp, currentLanguage)}
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

  const handleSortChange = (field: string, direction: Direction) => {
    setSort(field);
    setOrder(direction);
  }

  const handleFormSubmit = async (record: RuleEndpoint) => {
    await createRuleEndpoint(record?.metadata?.namespace || namespace || 'default', record);
    mutate();
  };

  const handleYamlClick = async (_: any, row: ConciseRuleEndpoint) => {
    try {
      const resp = await getRuleEndpoint(row?.namespace || '', row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  const handleDeleteClick = (_: any, row: ConciseRuleEndpoint) => {
    showConfirmDialog({
      title: `${t('actions.delete')} ${t('common.ruleEndpoint')}`,
      content: `${t('messages.deleteConfirm')} ${row?.name}?`,
      onConfirm: async () => {
        try {
          await deleteRuleEndpoint(row?.namespace || '', row?.name || '');
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
          onAddClick={() => setAddDialogOpen(true)}
          onRefreshClick={() => mutate()}
          onViewOptionsClick={() => alert('View options button clicked')}
          onDetailClick={handleYamlClick}
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
            direction: order as Direction,
          }}
          onSortChange={handleSortChange}
          filter={(
            <>
              <TextField
                size='small'
                label={t('table.name')}
                value={name || ''}
                onChange={(e) => setName(e.target.value || '')}
                placeholder={t('table.textWildcardHelp')}
              />
            </>
          )}
        />
      </Box>
      <AddRuleEndpointDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleFormSubmit}
        onCreated={() => setAddDialogOpen(false)}
      />
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
      {ConfirmDialogComponent}
    </Box>
  );
}
