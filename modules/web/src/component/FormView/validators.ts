import { z } from 'zod';
import type { FieldSchema, Rule } from './schema/types';

export function ruleToZod(field: FieldSchema) {
  let s: z.ZodTypeAny = z.any();

  switch (field.type) {
    case 'text': case 'password': case 'textarea':
      s = z.string().or(z.literal('')).transform(v => v ?? '');
      break;
    case 'number':
      s = z.coerce.number();
      break;
    case 'select': case 'radio':
      s = z.string().or(z.literal('')).transform(v => v ?? '');
      break;
    case 'multi-select':
      s = z.array(z.union([z.string(), z.number()]));
      break;
    case 'switch':
      s = z.boolean();
      break;
    case 'date':
      s = z.date().or(z.string());
      break;
    case 'array':
      s = z.array(z.any());
      break;
    default:
      break;
  }

  (field.rules || []).forEach((r: Rule) => {
    if (r.type === 'required') {
      s = s.refine(v => !(v === undefined || v === '' || v === null),
        { message: r.message || 'form.error.required' });
    }
    if (r.type === 'min' && field.type === 'number') {
      s = (s as unknown as z.ZodNumber).min(r.value, { message: r.message || 'form.error.min' });
    }
    if (r.type === 'max' && field.type === 'number') {
      s = (s as unknown as z.ZodNumber).max(r.value, { message: r.message || 'form.error.max' });
    }
    if (r.type === 'regex' && (field.type === 'text' || field.type === 'password' || field.type === 'textarea')) {
      s = (s as z.ZodString).regex(r.value, r.message || 'form.error.regex');
    }
    if (r.type === 'in') {
      s = s.refine(v => Array.isArray(r.values) && r.values.includes(v),
        { message: r.message || 'form.error.in' });
    }
    if (r.type === 'custom') {
      s = s.refine((v) => r.fn(v, undefined) === true, { message: 'form.error.custom' });
    }
  });

  return s;
}

function getSchemaShape(
  fields: FieldSchema[],
  topShape: Record<string, z.ZodTypeAny>,
  conditions: Map<string, Map<string, string[]>>,
  isNested = false
) {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((f) => {
    let s;
    if (f.type === 'array' && f.itemSchema) {
      s = z.array(getSchemaShape(f.itemSchema, topShape, conditions, true));
    } else {
      s = ruleToZod(f);
    }
    if (f.ruleIf) {
      const { field, value } = f.ruleIf;
      const fieldMap = conditions.get(field) || new Map<string, string[]>();
      const valueMap = fieldMap.get(value.toString()) || [];
      valueMap.push(f.name);
      fieldMap.set(value.toString(), valueMap);
      conditions.set(field, fieldMap);
    }
    shape[f.name] = s;
    if (!isNested) {
      topShape[f.name] = s;
    }
  });

  return z.object(shape);
}

export function schemaToZod(fields: FieldSchema[]) {
  const topShape: Record<string, z.ZodTypeAny> = {};
  const conditions: Map<string, Map<string, string[]>> = new Map();
  getSchemaShape(fields, topShape, conditions);

  const newTopShape = { ...topShape };
  conditions.forEach((fieldMap, key) => {
    delete newTopShape[key];
    fieldMap.forEach((fields) => {
      fields.forEach((field) => {
        delete newTopShape[field];
      });
    });
  });

  let schemaZod = z.object(newTopShape);
  conditions.forEach((objs, key) => {
    const schemaArr: any[] = [];
    objs.forEach((fields, value) => {
      const shape: Record<string, z.ZodTypeAny> = {};
      fields.forEach((fName) => {
        shape[fName] = topShape[fName];
      });
      let partialSchema = schemaZod.extend({
        [key]: z.literal(value),
        ...shape,
      });
      schemaArr.push(partialSchema);
    });

    // @ts-ignore
    schemaZod = z.discriminatedUnion(key, schemaArr);
  });

  return schemaZod;
}
