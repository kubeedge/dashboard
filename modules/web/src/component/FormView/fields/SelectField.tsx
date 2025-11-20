'use client';

import { Controller, useWatch } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/hook/useI18n';

export default function SelectField({ field, control }: any) {
  const [opts, setOpts] = useState<any[]>(Array.isArray(field.options) ? field.options : []);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof field.options === 'function') {
      const result = field.options();
      if (result instanceof Promise) {
        result.then((data: any[]) => setOpts(data));
      } else {
        setOpts(result);
      }
    }
  }, [field]);

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{/.+\..+/.test(field.label) ? t(field.label) : field.label}</InputLabel>
          <Select
            label={/.+\..+/.test(field.label) ? t(field.label) : field.label}
            multiple={field.type === 'multi-select'}
            {...rhf}
          >
            {opts.map(o => <MenuItem
              key={o.value}
              value={o.value}
              disabled={o.disabled}
            >
              {/.+\..+/.test(o.label) ? t(o.label) : o.label}
            </MenuItem>
            )}
          </Select>
          <FormHelperText>
            {error?.message && /.+\..+/.test(error.message)
              ? `${t(field.label)} ${t(error?.message || field.helperText)}`
              : error?.message || field.helperText}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
