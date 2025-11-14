'use client';

import { Grid, Box, Stack, Button } from '@mui/material';
import { useFormState } from './adapters/useFormState';
import type { FormSchema, FieldSchema } from './schema/types';
import { getFieldComponent } from './fields/registry';
import { useI18n } from '@/hook/useI18n';

function renderField(field: FieldSchema, control: any, values: any) {
  if (field.visibleWhen && !field.visibleWhen(values)) return null;
  const Comp = getFieldComponent(field.type);

  if (typeof Comp !== 'function') {
    console.error('Bad field component:', field.type, Comp);
    return null;
  }

  const grid = field.grid || { xs: 12, md: 6 };
  return (
    <Grid item key={field.name} xs={grid.xs ?? 12} sm={grid.sm ?? grid.xs ?? 12} md={grid.md ?? 6} lg={grid.lg ?? grid.md ?? 6}>
      <Box sx={{ opacity: field.disabledWhen?.(values) ? 0.6 : 1, pointerEvents: field.disabledWhen?.(values) ? 'none' : 'auto' }}>
        <Comp field={field} control={control} />
      </Box>
    </Grid>
  );
}

export default function FormView({
  schema,
  onSubmit,
  initialValues,
  submitting,
  formId,
  hideActions,
}: {
  schema: FormSchema;
  onSubmit: (values: any) => Promise<void> | void;
  initialValues?: Record<string, any>;
  submitting?: boolean;
  formId?: string;
  hideActions?: boolean;
}) {
  const { t } = useI18n();
  const form = useFormState(schema, initialValues);
  const { handleSubmit, control, watch, reset } = form;
  const values = watch();

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {schema.fields.map(f => renderField(f, control, values))}
      </Grid>

      {!hideActions && (
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
          {schema.resetText && (
            <Button type="reset" onClick={() => reset(initialValues || {})}>
              {t(schema.resetText)}
            </Button>
          )}
          {schema.submitText && (
            <Button type="submit" disabled={submitting}>
              {t(schema.submitText)}
            </Button>
          )}
        </Stack>
      )}
    </form>
  );
}
