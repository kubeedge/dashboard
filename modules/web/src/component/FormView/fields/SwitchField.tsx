'use client';

import { Controller } from 'react-hook-form';
import { FormControlLabel, Switch } from '@mui/material';

export default function SwitchField({ field, control }: any) {
  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf }) => (
        <FormControlLabel control={<Switch checked={!!rhf.value} onChange={(_, v) => rhf.onChange(v)} />} label={field.label} />
      )}
    />
  );
}
