import React from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useI18n } from '@/hook/useI18n';
import { TableCardPagination, type Pagination } from './pagination';

export interface ColumnDefinition<T> {
  name?: string;
  key?: string;
  render?: (row: T) => React.ReactNode | string | undefined;
  renderOperation?: boolean;
}

interface TableCardProps<T> {
  addButtonLabel?: string;
  title?: string;
  columns?: ColumnDefinition<T>[];
  data?: T[];
  onQueryClick?: (event: React.MouseEvent, data: T, index: number) => void;
  onAddClick?: (event: React.MouseEvent) => void;
  onRefreshClick?: (event: React.MouseEvent) => void;
  onViewOptionsClick?: (event: React.MouseEvent) => void;
  onDetailClick?: (event: React.MouseEvent, data: T, index: number) => void;
  onDeleteClick?: (event: React.MouseEvent, data: T, index: number) => void;
  showAddButton?: boolean;
  specialHandling?: boolean;
  detailButtonLabel?: string;
  deleteButtonLabel?: string;
  noTableHeader?: boolean;
  /**
   * If true, pagination controls will not be displayed.
   */
  noPagination?: boolean;
  /**
   * If true, the "Add" button will not be displayed.
   */
  noAddButton?: boolean;
  /**
   * Pagination information. If provided, the component will use this for pagination instead of internal state.
   */
  pagination?: Pagination;

  rowsPerPageOptions?: number[];
  /**
   * Callback when pagination changes (page or page size).
   */
  onPaginationChange?: (page: number, pageSize: number) => void;
  /**
   * Filter component to be displayed above the table.
   */
  filter?: React.ReactNode;
  /**
   * Loading state for the table data.
   */
  loading?: boolean;
}

export function TableCard<T>({
  title,
  addButtonLabel,
  columns,
  data,
  onAddClick,
  onRefreshClick,
  onViewOptionsClick,
  onDetailClick,
  onDeleteClick,
  detailButtonLabel,
  deleteButtonLabel,
  noAddButton = false,
  noTableHeader = false,
  noPagination = false,
  pagination,
  filter,
  onPaginationChange,
  rowsPerPageOptions,
  loading,
}: TableCardProps<T>) {
  return (
    <Paper sx={{ boxShadow: 'none' }}>
      {/* Header */}
      {!noTableHeader && (
        <Box
          sx={{
            padding: '16px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {!noAddButton && (
              <Button
                onClick={onAddClick}
                variant="contained"
                startIcon={<AddIcon />}
              >
                {addButtonLabel}
              </Button>
            )}
            <IconButton onClick={onRefreshClick}>
              <RefreshIcon />
            </IconButton>
            <IconButton onClick={onViewOptionsClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Filter */}
      {filter && (
        <Box
          sx={{
            padding: '16px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#2b2b2b' : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {filter}
        </Box>
      )}

      {/* Table */}
      <TableContainer
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns?.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{ textAlign: 'center', padding: '16px' }}
                >
                  {typeof col === 'string' ? col : col.name}
                </TableCell>
              ))}
              <TableCell sx={{ textAlign: 'center', padding: '16px' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell align="center" colSpan={columns?.length || 1}>
                  <Box sx={{ p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                </TableCell>
              </TableRow>
            ) : data?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns?.map((col, colIndex) => {
                  if (col.renderOperation) {
                    return (
                      <TableCell key={colIndex} sx={{ textAlign: 'center' }}>
                        {detailButtonLabel && (
                          <Button
                            onClick={(event) =>
                              onDetailClick?.(event, row, colIndex)
                            }
                            sx={{ color: '#2F54EB', marginRight: '8px' }}
                          >
                            {detailButtonLabel}
                          </Button>
                        )}
                        {deleteButtonLabel && (
                          <Button
                            onClick={(event) =>
                              onDeleteClick?.(event, row, colIndex)
                            }
                            sx={{ color: '#ff4d4f' }}
                          >
                            {deleteButtonLabel}
                          </Button>
                        )}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={colIndex} sx={{ textAlign: 'center' }}>
                      {col.render ? col.render(row) : (row as any)[colIndex]}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!noPagination && pagination && (
        <TableCardPagination
          pagination={pagination}
          onPaginationChange={onPaginationChange || (() => { })}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      )}
    </Paper>
  );
}
