import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';

export interface VirtualTableColumn<T> {
  key: string;
  title: string;
  width?: number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  fixed?: 'left' | 'right';
}

export interface VirtualTableProps<T> {
  columns: VirtualTableColumn<T>[];
  data: T[];
  height: number;
  rowHeight?: number;
  loading?: boolean;
  error?: any;
  emptyText?: string;
  onRowClick?: (record: T, index: number) => void;
  getRowKey?: (record: T, index: number) => string | number;
  // Virtual scrolling related
  overscanCount?: number; // Number of pre-rendered rows
  enableVirtualScroll?: boolean; // Whether to enable virtual scrolling
}

const DEFAULT_ROW_HEIGHT = 48;
const DEFAULT_COLUMN_WIDTH = 150;
const DEFAULT_OVERSCAN_COUNT = 5;

export function VirtualTable<T>({
  columns,
  data,
  height,
  rowHeight = DEFAULT_ROW_HEIGHT,
  loading = false,
  error = null,
  emptyText = 'No Data',
  onRowClick,
  getRowKey = (_, index) => index,
  overscanCount = DEFAULT_OVERSCAN_COUNT,
  enableVirtualScroll = true,
}: VirtualTableProps<T>) {

  const columnWidths = useMemo(() => {
    return columns.map(col => col.width || DEFAULT_COLUMN_WIDTH);
  }, [columns]);

  const totalWidth = useMemo(() => {
    return columnWidths.reduce((sum, width) => sum + width, 0);
  }, [columnWidths]);

  // Virtual scrolling row component
  const VirtualRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const record = data[index];
    if (!record) return null;

    return (
      <TableRow
        style={style}
        onClick={() => onRowClick?.(record, index)}
        sx={{
          cursor: onRowClick ? 'pointer' : 'default',
          '&:hover': onRowClick ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {},
        }}
      >
        {columns.map((column, colIndex) => (
          <TableCell
            key={column.key}
            style={{
              width: columnWidths[colIndex],
              minWidth: columnWidths[colIndex],
              maxWidth: columnWidths[colIndex],
            }}
            sx={{
              textAlign: 'center',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
            }}
          >
            {column.render
              ? column.render((record as any)[column.key], record, index)
              : (record as any)[column.key]
            }
          </TableCell>
        ))}
      </TableRow>
    );
  }, [columns, columnWidths, data, onRowClick]);

  // Normal table row component (non-virtual scrolling)
  const NormalRow = useCallback(({ record, index }: { record: T; index: number }) => (
    <TableRow
      key={getRowKey(record, index)}
      onClick={() => onRowClick?.(record, index)}
      sx={{
        cursor: onRowClick ? 'pointer' : 'default',
        '&:hover': onRowClick ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {},
      }}
    >
      {columns.map((column, colIndex) => (
        <TableCell
          key={column.key}
          style={{
            width: columnWidths[colIndex],
            minWidth: columnWidths[colIndex],
            maxWidth: columnWidths[colIndex],
          }}
          sx={{
            textAlign: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
          }}
        >
          {column.render
            ? column.render((record as any)[column.key], record, index)
            : (record as any)[column.key]
          }
        </TableCell>
      ))}
    </TableRow>
  ), [columns, columnWidths, getRowKey, onRowClick]);

  // Status handling moved to ProTable component, only handle table rendering here

  return (
    <Paper sx={{ height, overflow: 'hidden' }}>
      <TableContainer sx={{ height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.key}
                  style={{
                    width: columnWidths[index],
                    minWidth: columnWidths[index],
                    maxWidth: columnWidths[index],
                  }}
                  sx={{
                    textAlign: 'center',
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold',
                    borderBottom: '2px solid rgba(224, 224, 224, 1)',
                  }}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>

        {enableVirtualScroll && data.length > 100 ? (
          // Virtual scrolling mode (large data volume)
          <Box sx={{ height: `calc(100% - 64px)` }}>
            <List
              height={height - 64}
              itemCount={data.length}
              itemSize={rowHeight}
              width={totalWidth}
              overscanCount={overscanCount}
              itemKey={(index) => getRowKey(data[index], index)}
            >
              {VirtualRow}
            </List>
          </Box>
        ) : (
          // Normal mode (small data volume)
          <TableBody>
            {data.map((record, index) => (
              <NormalRow key={getRowKey(record, index)} record={record} index={index} />
            ))}
          </TableBody>
        )}
      </TableContainer>
    </Paper>
  );
}