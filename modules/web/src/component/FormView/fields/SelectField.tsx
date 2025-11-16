'use client';

import { Controller, useWatch } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hook/useI18n';

export default function SelectField({ field, control }: any) {
  const [opts, setOpts] = useState<any[]>(Array.isArray(field.options) ? field.options : []);
  const { t } = useI18n();
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (typeof field.options === 'function') {
      const res = field.options();
      if (res instanceof Promise) {
        res.then(setOpts).catch(() => setOpts([]));
      } else {
        setOpts(res);
      }
    }
  }, [field]);

  useEffect(() => {
    if (typeof field.options === 'function') {
      const res = field.options();
      if (res instanceof Promise) {
        res.then(setOpts).catch(() => setOpts([]));
      } else {
        setOpts(res);
      }
    }
  }, [watchedValues, field]);

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{t(field.label)}</InputLabel>
          <Select
            label={t(field.label)}
            multiple={field.type === 'multi-select'}
            {...rhf}
          >
            {opts.map(o => <MenuItem key={o.value} value={o.value} disabled={o.disabled}>{t(o.label)}</MenuItem>)}
          </Select>
          <FormHelperText>{error?.message && `${t(field.label)} ${t(error?.message || field.helperText)}`}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
