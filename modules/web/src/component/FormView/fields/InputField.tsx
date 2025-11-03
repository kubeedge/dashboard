'use client';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export default function InputField({ field, control }: any) {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <TextField
          {...rhf}
          type={field.type === 'password' ? 'password' : 'text'}
          label={field.label}
          placeholder={field.placeholder}
          fullWidth={field.fullWidth ?? true}
          error={!!error}
          helperText={error?.message || field.helperText}
        />
      )}
    />
  );
}
