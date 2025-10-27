import React, { useState, useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';

export interface CascadeOption {
  value: string | number;
  label: string;
  hasChildren?: boolean;
}

export interface CascadeSelectProps {
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  loadData?: (parentValue?: string | number) => Promise<CascadeOption[]>;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium';
  maxLevel?: number;
}

export function CascadeSelect({
  value = [],
  onChange,
  loadData,
  placeholder = 'Please Select',
  disabled = false,
  size = 'medium',
  maxLevel = 3,
}: CascadeSelectProps) {
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(value);
  const [options, setOptions] = useState<CascadeOption[][]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);

  const handleLevelChange = useCallback(async (level: number, selectedValue: string | number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[level] = selectedValue;
    newSelectedValues.splice(level + 1);

    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);

    if (loadData && level < maxLevel - 1) {
      setLoading(prev => {
        const newLoading = [...prev];
        newLoading[level + 1] = true;
        return newLoading;
      });

      try {
        const newOptions = await loadData(selectedValue);
        setOptions(prev => {
          const newOpts = [...prev];
          newOpts[level + 1] = newOptions;
          newOpts.splice(level + 2);
          return newOpts;
        });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(prev => {
          const newLoading = [...prev];
          newLoading[level + 1] = false;
          return newLoading;
        });
      }
    }
  }, [selectedValues, onChange, loadData, maxLevel]);

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {Array.from({ length: maxLevel }, (_, index) => (
        <FormControl key={index} size={size} disabled={disabled || loading[index]}>
          <InputLabel>
            {loading[index] ? 'Loading...' : `Level ${index + 1}`}
          </InputLabel>
          <Select
            value={selectedValues[index] || ''}
            onChange={(e) => handleLevelChange(index, e.target.value)}
            label={loading[index] ? 'Loading...' : `Level ${index + 1}`}
          >
            {(options[index] || []).map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
}