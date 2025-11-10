'use client';

import { Controller } from 'react-hook-form';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hook/useI18n';

export default function SelectField({ field, control }: any) {
  const [opts, setOpts] = useState<any[]>(Array.isArray(field.options) ? field.options : []);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof field.options === 'function') field.options().then(setOpts).catch(() => setOpts([]));
  }, [field]);

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error}>
          <InputLabel>{t(field.label)}</InputLabel>
          <Select label={t(field.label)} {...rhf}>
            {opts.map(o => <MenuItem key={o.value} value={o.value} disabled={o.disabled}>{o.label}</MenuItem>)}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
