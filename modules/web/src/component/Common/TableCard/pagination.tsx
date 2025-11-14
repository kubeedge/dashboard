import { Box, IconButton, TablePagination, useTheme } from "@mui/material";
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useI18n } from "@/hook/useI18n";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface TableCardPaginationProps {
  pagination: Pagination;
  rowsPerPageOptions?: number[];
  onPaginationChange: (page: number, pageSize: number) => void;
}

export const TableCardPagination = ({ pagination, rowsPerPageOptions, onPaginationChange }: TableCardPaginationProps) => {
  const { t } = useI18n();
  const currentPage = pagination.current - 1;
  const currentPageSize = pagination.pageSize;
  const total = pagination.total;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    onPaginationChange(newPage + 1, currentPageSize);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPaginationChange(1, newPageSize);
  };

  return ((
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions || [10, 25, 50]}
      component="div"
      count={total}
      rowsPerPage={currentPageSize}
      page={currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage={t('table.rowsPerPage')}
      labelDisplayedRows={(info) => {
        return `${info.from}-${info.to} ${t('table.of')} ${info.count}`;
      }}
      ActionsComponent={TablePaginationActions}
    />
  ))
}
