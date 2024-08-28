import { IconButton, Box } from '@mui/material'
import { Circle, MoreVert } from '@mui/icons-material';
import { Pod } from '@/types/pod';
import { ColumnDefinition, TableCard } from '../TableCard';
import { getPodStatus } from '@/helper/status';

const statusColor = {
  Running: 'green',
  Fault: 'orange',
  Disabled: 'red',
  Unmanaged: 'lightgrey'
};

interface PodsTableProps {
  data?: Pod[];
}

const columns: ColumnDefinition<Pod>[] = [
  {
    name: '',
    key: 'status-icon',
    render: (row) => <Circle style={{ color: (statusColor as any)[row.status?.phase || 'Fault'] || 'lightgrey', fontSize: 10 }}/>
  },
  {
    name: 'Name',
    render: (row) => row.metadata?.name,
  },
  {
    name: 'Namespace',
    render: (row) => row.metadata?.namespace,
  },
  {
    name: 'Images',
    render: (row) => row.status?.containerStatuses?.map(status => status?.image)?.map((image) => (
      <>
        <span>{image}</span>
        <br/>
      </>
    )),
  },
  {
    name: 'Labels',
    render: (row) => Object.keys(row.metadata?.labels || {})?.map((value: string) => {
      return (
        <>
          <span>{`${value}: ${row.metadata?.labels?.[value]}`}</span><br/>
        </>
      );
    }),
  },
  {
    name: 'Node',
    render: (row) => row.spec?.nodeName,
  },
  {
    name: 'Status',
    render: (row) => getPodStatus(row),
  },
  {
    name: 'Restarts',
    render: (row) => row.status?.containerStatuses?.reduce((prev, cur) => prev + (cur.restartCount || 0), 0),
  },
  {
    name: 'CPU',
    render: (row) => row.spec?.containers?.at(0)?.resources?.requests?.cpu,
  },
  {
    name: 'Memory',
    render: (row) => row.spec?.containers?.at(0)?.resources?.requests?.memory,
  },
  {
    name: 'Created',
    render: (row) => row.metadata?.creationTimestamp,
  }
]

export const PodsTable = (props: PodsTableProps) => {
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