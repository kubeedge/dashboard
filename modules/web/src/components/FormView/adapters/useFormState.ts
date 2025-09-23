import { useMemo } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormSchema } from '../schema/types';
import { schemaToZod } from '../validators';

export function useFormState(schema: FormSchema, initial?: Record<string, any>) {
  const zod = useMemo(() => schemaToZod(schema.fields), [schema]);
  const form = useForm({
    resolver: zodResolver(zod),
    defaultValues: buildDefaults(schema, initial),
    mode: 'onBlur',
  });
  return form as UseFormReturn<any>;
}

function buildDefaults(schema: FormSchema, initial?: Record<string, any>) {
  const d: Record<string, any> = {};
  schema.fields.forEach(f => {
    d[f.name] = initial?.[f.name] ?? f.defaultValue ?? defaultByType(f.type);
  });
  return d;
}
function defaultByType(type: string) {
  if (type === 'switch') return false;
  if (type === 'multi-select') return [];
  return '';
}
