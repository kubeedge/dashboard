import { IconButton, Box } from '@mui/material'
import { Circle, MoreVert } from '@mui/icons-material';
import { Pod } from '@/types/pod';
import { ColumnDefinition, TableCard } from '@/components/Common/TableCard';
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
    render: (row: Pod) => <Circle style={{ color: (statusColor as any)[row.status?.phase || 'Fault'] || 'lightgrey', fontSize: 10 }}/>
  },
  {
    name: 'Name',
    render: (row: Pod) => row.metadata?.name,
  },
  {
    name: 'Namespace',
    render: (row: Pod) => row.metadata?.namespace,
  },
  {
    name: 'Images',
    render: (row: Pod) => row.status?.containerStatuses?.map((status: any) => status?.image)?.map((image: string) => (
      <>
        <span>{image}</span>
        <br/>
      </>
    )),
  },
  {
    name: 'Labels',
    render: (row: Pod) => Object.keys(row.metadata?.labels || {})?.map((value: string) => {
      return (
        <>
          <span>{`${value}: ${row.metadata?.labels?.[value]}`}</span><br/>
        </>
      );
    }),
  },
  {
    name: 'Node',
    render: (row: Pod) => row.spec?.nodeName,
  },
  {
    name: 'Status',
    render: (row: Pod) => getPodStatus(row),
  },
  {
    name: 'Restarts',
    render: (row: Pod) => row.status?.containerStatuses?.reduce((prev: number, cur: any) => prev + (cur.restartCount || 0), 0),
  },
  {
    name: 'CPU',
    render: (row: Pod) => row.spec?.containers?.at(0)?.resources?.requests?.cpu,
  },
  {
    name: 'Memory',
    render: (row: Pod) => row.spec?.containers?.at(0)?.resources?.requests?.memory,
  },
  {
    name: 'Created',
    render: (row: Pod) => row.metadata?.creationTimestamp,
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