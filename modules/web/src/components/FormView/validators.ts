import { z } from 'zod';
import type { FieldSchema, Rule } from './schema/types';

export function ruleToZod(field: FieldSchema) {
  let s: z.ZodTypeAny = z.any();

  switch (field.type) {
    case 'text': case 'password': case 'textarea':
      s = z.string().or(z.literal('')).transform(v => v ?? '');
      break;
    case 'number':s = z.coerce.number();break;
    case 'select': case 'radio': s = z.union([z.string(), z.number()]); break;
    case 'multi-select': s = z.array(z.union([z.string(), z.number()])); break;
    case 'switch': s = z.boolean(); break;
    case 'date': s = z.date().or(z.string()); break;
    case 'array':s = z.array(z.any());break;
    default: break;
  }

  (field.rules || []).forEach((r: Rule) => {
    if (r.type === 'required') s = s.refine(v => !(v === undefined || v === '' || v === null), { message: r.message || 'form.error.required' });
    if (r.type === 'min' && field.type === 'number') {
  s = (s as unknown as z.ZodNumber).min(r.value, { message: r.message || 'form.error.min' });
}
    if (r.type === 'max' && field.type === 'number') {
  s = (s as unknown as z.ZodNumber).max(r.value, { message: r.message || 'form.error.max' });
}
    if (r.type === 'regex' && (field.type === 'text' || field.type === 'password' || field.type === 'textarea'))
      s = (s as z.ZodString).regex(r.value, r.message || 'form.error.regex');
    if (r.type === 'custom') s = s.refine((v) => r.fn(v, undefined) === true, { message: 'form.error.custom' });
  });
  return s;
}

export function schemaToZod(fields: FieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach(f => (shape[f.name] = ruleToZod(f)));
  return z.object(shape);
}
