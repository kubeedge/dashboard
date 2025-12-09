'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { ColumnDefinition, TableCard } from '@/component/Common/TableCard';
import { getCustomResourceDefinition, useListCustomResourceDefinitions } from '@/api/customResourceDefinition';
import YAMLViewerDialog from '@/component/Dialog/YAMLViewerDialog';
import { ConciseCustomResourceDefinition } from '@/types/customResourceDefinition';
import { useAlert } from '@/hook/useAlert';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatRelativeTime } from '@/helper/localization';

export default function CrdPage() {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('');
  const [order, setOrder] = useState('');
  const [name, setName] = useState('');
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const [currentYamlContent, setCurrentYamlContent] = React.useState<any>(undefined);
  const { error } = useAlert();
  const params = useMemo(() => ({
    page,
    pageSize,
    sort,
    order,
    filter: [name ? `name:${name}` : undefined].filter(Boolean).join(','),
  }), [page, pageSize, sort, order, name]);
  const { data, mutate, isLoading } = useListCustomResourceDefinitions(params);

  const columns: ColumnDefinition<ConciseCustomResourceDefinition>[] = [{
    key: 'name',
    name: t('table.name'),
    sortable: true,
    render: (row) => row?.name,
  }, {
    name: t('table.group'),
    render: (row) => row?.group,
  }, {
    name: t('table.kind'),
    render: (row) => row?.kind,
  }, {
    name: t('table.scope'),
    render: (row) => row?.scope === 'Namespaced' ? t('table.namespaced') : t('table.cluster'),
  }, {
    key: 'creationTimestamp',
    name: t('table.creationTime'),
    sortable: true,
    render: (row) => (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
          {formatDateTime(row?.creationTimestamp, currentLanguage)}
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {formatRelativeTime(row?.creationTimestamp, currentLanguage)}
        </Box>
      </Box>
    )
  }, {
    name: t('table.operation'),
    renderOperation: true,
  }];

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSort(field);
    setOrder(direction);
  }

  const handleYamlClick = async (_: any, row: ConciseCustomResourceDefinition) => {
    try {
      const resp = await getCustomResourceDefinition(row?.name || '');
      setCurrentYamlContent(resp?.data);
      setYamlDialogOpen(true);
    } catch (err: any) {
      error(err?.response?.data?.message || err?.message || t('messages.error'));
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ width: '100%', p: '20px', minHeight: 350, bgcolor: 'background.paper' }}>
        <TableCard
          title={t('common.crd')}
          columns={columns}
          data={data?.items}
          onQueryClick={() => mutate()}
          onDetailClick={handleYamlClick}
          detailButtonLabel={t('actions.yaml')}
          noAddButton
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
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={currentYamlContent}
      />
    </Box>
  );
}
