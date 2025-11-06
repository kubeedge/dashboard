import React from 'react';
import { Box, Button, IconButton, Typography, Paper, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import { StatusFeedback } from '@/component/Common/StatusFeedback';
import { CascadeSelect } from '@/component/Common/CascadeSelect';

export interface ProTableProps<T> {
  title?: string;
  data: T[];
  loading?: boolean;
  error?: any;
  onAdd?: () => void;
  onRefresh?: () => void;
  children?: React.ReactNode;

  // Search and filtering
  search?: string;
  onSearchChange?: (search: string) => void;
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  filterOptions?: {
    key: string;
    label: string;
    options: { label: string; value: any }[];
  }[];

  // Cascade selector
  cascadeOptions?: {
    key: string;
    label: string;
    loadData: (parentValue?: string | number) => Promise<{ value: string | number; label: string; hasChildren?: boolean }[]>;
  }[];

  // Status feedback
  statusFeedback?: {
    variant?: 'default' | 'card' | 'minimal';
    height?: number | string;
  };
}

export function ProTable<T>({
  title,
  data,
  loading = false,
  error = null,
  onAdd,
  onRefresh,
  children,
  search = '',
  onSearchChange,
  filters = {},
  onFiltersChange,
  filterOptions = [],
  cascadeOptions = [],
  statusFeedback = {},
}: ProTableProps<T>) {
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        {title && (
          <Typography variant="h6" sx={{ flexShrink: 0 }}>
            {title}
          </Typography>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Search box */}
          {onSearchChange && (
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 200 }}
            />
          )}

          {/* Filter selectors */}
          {filterOptions.map((filter) => (
            <FormControl key={filter.key} size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filters[filter.key] || ''}
                label={filter.label}
                onChange={(e) => {
                  const newFilters = { ...filters, [filter.key]: e.target.value };
                  onFiltersChange?.(newFilters);
                }}
              >
                <MenuItem value="">All</MenuItem>
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          {/* Cascade selectors */}
          {cascadeOptions.map((cascade) => (
            <CascadeSelect
              key={cascade.key}
              loadData={cascade.loadData}
              onChange={(values) => {
                const newFilters = { ...filters, [cascade.key]: values };
                onFiltersChange?.(newFilters);
              }}
              size="small"
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
            >
              Add
            </Button>
          )}

          {onRefresh && (
            <IconButton onClick={onRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <StatusFeedback
          status={loading ? 'loading' : error ? 'error' : data.length === 0 ? 'empty' : 'idle'}
          error={error ? { message: error.message || 'Load failed' } : undefined}
          errorAction={error ? { text: 'Retry', onClick: onRefresh || (() => { }) } : undefined}
          height={statusFeedback.height || 400}
          variant={statusFeedback.variant || 'default'}
        >
          {children}
        </StatusFeedback>
      </Box>
    </Paper>
  );
}
