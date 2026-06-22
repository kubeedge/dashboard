import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material"

/**
 * Definition of a column in the table.
 */
export interface ColumnDefinition<T> {
  /**
   * The display name of the column.
   */
  name?: string;
  /**
   * The unique key for the column, default the index will be used if not provided.
   * It is required for sortable columns.
   */
  key?: string;
  /**
   * A function to render the content of the cell.
   *
   * @param row The data object for the current row.
   * @returns The content to be rendered in the cell.
   */
  render?: (row: T) => React.ReactNode | string | undefined;
  /**
   * Indicates if this column is for operation buttons (like detail, delete).
   */
  renderOperation?: boolean;
  /**
   * Indicates if this column is sortable.
   */
  sortable?: boolean;
}

/**
 * Sorting direction type.
 */
export type Direction = 'asc' | 'desc';

/**
 * Current sort state.
 */
export interface SortState {
  /**
   * The field being sorted.
   */
  field: string;
  /**
   * The direction of sorting.
   */
  direction: Direction;
}

/**
 * Props for the TableCardHeader component.
 */
export interface TableCardHeaderProps<T> {
  /**
   * Column definitions for the table.
   */
  columns?: ColumnDefinition<T>[];
  /**
   * Current sort state.
   */
  sort?: SortState;
  /**
   * Callback when sort changes.
   */
  onSortChange?: (field: string, direction: Direction) => void;
}

/**
 * TableCardHeader component renders the header row of the table with sortable columns.
 *
 * @param props The props for the TableCardHeader component.
 * @returns The rendered TableCardHeader component.
 */
export function TableCardHeader<T>({ columns, sort, onSortChange }: TableCardHeaderProps<T>) {
  const handleSortChange = (field: string) => {
    const isAsc = sort?.field === field && sort?.direction === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    onSortChange?.(field, newDirection);
  }

  return (
    <TableHead>
      <TableRow>
        {columns?.map((col, index) => {
          return col.sortable ? (
            <TableCell
              key={col.key || index}
              sortDirection={sort?.field === col.key ? sort?.direction || false : false}
              sx={{ textAlign: 'center', padding: '16px' }}
            >
              <TableSortLabel
                active={(sort && sort?.field === col.key) || false}
                direction={(sort && sort?.field === col.key) ? sort?.direction : 'asc'}
                onClick={() => handleSortChange(col.key || '')}
              >
                {typeof col === 'string' ? col : col.name}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell
              key={col.key || index}
              sx={{ textAlign: 'center', padding: '16px' }}
            >
              {typeof col === 'string' ? col : col.name}
            </TableCell>
          )
        })}
        <TableCell sx={{ textAlign: 'center', padding: '16px' }} />
      </TableRow>
    </TableHead>
  )
}
