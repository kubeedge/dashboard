'use client';

import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, FormHelperText } from '@mui/material';

export default function RadioField({ field, control }: any) {
  const options = Array.isArray(field.options) ? field.options : [];

  return (
    <Controller
      name={field.name}
      control={control}
      render={({ field: rhf, fieldState: { error } }) => (
        <FormControl error={!!error}>
          {field.label && <FormLabel>{field.label}</FormLabel>}
          <RadioGroup {...rhf} row={field.row ?? false}>
            {options.map((o: any) => (
              <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
            ))}
          </RadioGroup>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
