import { IconButton, Box, Chip } from '@mui/material'
import { Circle, MoreVert } from '@mui/icons-material';
import { Pod } from '@/types/pod';
import { ColumnDefinition, TableCard } from '../TableCard';
import { getPodStatus } from '@/helper/status';
import { useI18n } from '@/hook/useI18n';
import {
  formatRelativeTime,
  formatCpuResource,
  formatMemoryResource,
  formatStatus
} from '@/helper/localization';

const statusColor = {
  Running: 'green',
  Fault: 'orange',
  Disabled: 'red',
  Unmanaged: 'lightgrey'
};

interface PodsTableProps {
  data?: Pod[];
}

export const PodsTable = (props: PodsTableProps) => {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  const columns: ColumnDefinition<Pod>[] = [
    {
      name: '',
      key: 'status-icon',
      render: (row) => <Circle style={{ color: (statusColor as any)[row.status?.phase || 'Fault'] || 'lightgrey', fontSize: 10 }} />
    },
    {
      name: t('table.name'),
      render: (row) => row.metadata?.name || '-',
    },
    {
      name: t('table.namespace'),
      render: (row) => row.metadata?.namespace || '-',
    },
    {
      name: t('table.image'),
      render: (row) => {
        const images = row.status?.containerStatuses?.map(status => status?.image);
        if (!images || images.length === 0) return '-';

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {images.map((image, index) => (
              <Chip
                key={index}
                label={image}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: 'auto',
                  '& .MuiChip-label': {
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px'
                  }
                }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      name: t('form.labels'),
      render: (row) => {
        const labels = row.metadata?.labels;
        if (!labels || Object.keys(labels).length === 0) return '-';

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {Object.entries(labels).slice(0, 3).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                size="small"
                variant="outlined"
                color="primary"
                sx={{
                  fontSize: '0.7rem',
                  height: 'auto',
                  '& .MuiChip-label': {
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '120px'
                  }
                }}
              />
            ))}
            {Object.keys(labels).length > 3 && (
              <Chip
                label={`+${Object.keys(labels).length - 3}`}
                size="small"
                variant="filled"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>
        );
      },
    },
    {
      name: t('common.node'),
      render: (row) => row.spec?.nodeName || '-',
    },
    {
      name: t('table.status'),
      render: (row) => {
        const status = getPodStatus(row);
        const localizedStatus = formatStatus(status, currentLanguage);

        const getStatusColor = (status: string) => {
          const statusLower = status.toLowerCase();
          if (statusLower.includes('running') || statusLower.includes('运行')) return 'success';
          if (statusLower.includes('pending') || statusLower.includes('等待')) return 'warning';
          if (statusLower.includes('failed') || statusLower.includes('失败')) return 'error';
          return 'default';
        };

        return (
          <Chip
            label={localizedStatus}
            size="small"
            color={getStatusColor(status) as any}
            variant="filled"
            sx={{ fontSize: '0.75rem' }}
          />
        );
      },
    },
    {
      name: t('table.restarts'),
      render: (row) => {
        const restarts = row.status?.containerStatuses?.reduce((prev, cur) => prev + (cur.restartCount || 0), 0);
        return restarts ? restarts.toString() : '0';
      },
    },
    {
      name: 'CPU',
      render: (row) => {
        const cpu = row.spec?.containers?.at(0)?.resources?.requests?.cpu;
        return formatCpuResource(cpu, currentLanguage);
      },
    },
    {
      name: t('dashboard.memory'),
      render: (row) => {
        const memory = row.spec?.containers?.at(0)?.resources?.requests?.memory;
        return formatMemoryResource(memory, currentLanguage);
      },
    },
    {
      name: t('table.creationTime'),
      render: (row) => formatRelativeTime(row.metadata?.creationTimestamp, currentLanguage),
    }
  ];

  return (
    <Box sx={{ width: '100%', minHeight: 350, backgroundColor: 'white' }}>
      <TableCard
        columns={columns}
        data={props?.data}
        noPagination={true}
        noTableHeader={true}
      />
    </Box>
  )
};