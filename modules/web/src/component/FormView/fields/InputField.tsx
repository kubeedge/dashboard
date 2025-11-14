'use client';

import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useI18n } from '@/hook/useI18n';

export default function InputField({ field, control }: any) {
  const { t } = useI18n();

  return (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.defaultValue ?? ''}
      render={({ field: rhf, fieldState: { error } }) => (
        <TextField
          {...rhf}
          type={field.type === 'password' ? 'password' : 'text'}
          label={t(field.label)}
          placeholder={t(field.placeholder)}
          fullWidth={field.fullWidth ?? true}
          error={!!error}
          helperText={error?.message && `${t(field.label)} ${t(error?.message || field.helperText)}`}
        />
      )}
    />
  );
}
