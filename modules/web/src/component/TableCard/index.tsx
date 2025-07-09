// src/component/TableCard.js
import React, { ChangeEvent } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';

export interface ColumnDefinition<T> {
  name?: string
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
  onRefreshClick?: (event: React.MouseEvent) => void,
  onViewOptionsClick?: (event: React.MouseEvent) => void;
  onDetailClick?: (event: React.MouseEvent, data: T, index: number) => void;
  onDeleteClick?: (event: React.MouseEvent, data: T, index: number) => void;
  showAddButton?: boolean;
  specialHandling?: boolean;
  specialBtnHandling?: boolean;
  detailButtonLabel?: string;
  deleteButtonLabel?: string;
  noTableHeader?: boolean;
  noPagination?: boolean;
}

export function TableCard<T>({
  title,
  addButtonLabel,
  columns,
  data,
  onQueryClick,
  onAddClick,
  onRefreshClick,
  onViewOptionsClick,
  onDetailClick,
  onDeleteClick,
  detailButtonLabel,
  deleteButtonLabel,
  specialHandling = false, // 新增的props用于特殊处理
  specialBtnHandling = false, // 新增的props用于按钮特殊处理
  noTableHeader=false,
  noPagination=false,
}: TableCardProps<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let paginatedData = data;
  if (!noPagination) {
    paginatedData = data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  return (
    <Paper>
      { !noTableHeader && (
        <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {!specialBtnHandling  ? (
                        <Button onClick={onAddClick} variant="contained" startIcon={<AddIcon />}>
                        {addButtonLabel}
                      </Button>
                      ) : (
                      ''
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns?.map((col, index) => (
                <TableCell key={index} sx={{ textAlign: 'center', padding: '16px' }}>
                  {typeof col === 'string' ? col : col.name}
                </TableCell>
              ))}
              <TableCell sx={{ textAlign: 'center', padding: '16px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {
                  columns?.map((col: ColumnDefinition<T>, colIndex: number) => {
                    if (col.renderOperation) {
                      return (
                        <TableCell key={colIndex} sx={{ textAlign: 'center' }}>
                          {detailButtonLabel && (
                            <Button onClick={(event) => onDetailClick?.(event, row, colIndex)} sx={{ color: '#2F54EB', marginRight: '8px' }}>
                              {detailButtonLabel}
                            </Button>
                          )}
                          {deleteButtonLabel && (
                            <Button onClick={(event) => onDeleteClick?.(event, row, colIndex)} sx={{ color: '#ff4d4f' }}>
                              {deleteButtonLabel}
                            </Button>
                          )}
                        </TableCell>
                      )
                    }

                    return <TableCell key={colIndex} sx={{ textAlign: 'center' }}>{col.render ? col.render(row) : (row as any)[colIndex]}</TableCell>
                  })
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!noPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}
