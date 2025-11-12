'use client';

import { Controller, useWatch } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hook/useI18n';

export default function SelectField({ field, control }: any) {
  const [opts, setOpts] = useState<any[]>(Array.isArray(field.options) ? field.options : []);
  const { t } = useI18n();

  if (field.watchFields && Array.isArray(field.watchFields) && field.watchFields.length > 0) {
    const watchedValues = useWatch({ control });
    useEffect(() => {
      if (typeof field.options === 'function') {
        field.options(null, watchedValues).then(setOpts).catch(() => setOpts([]));
      }
    }, [watchedValues, field]);
  } else {
    useEffect(() => {
      if (typeof field.options === 'function') field.options().then(setOpts).catch(() => setOpts([]));
    }, [field]);
  }

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
            {opts.map(o => <MenuItem key={o.value} value={o.value} disabled={o.disabled}>{o.label}</MenuItem>)}
          </Select>
          <FormHelperText>{error?.message && `${t(field.label)} ${t(error?.message || field.helperText)}`}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
