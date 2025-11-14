'use client';

import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFieldArray, Controller } from 'react-hook-form';
import InputField from './InputField';
import { useI18n } from '@/hook/useI18n';
import { getFieldComponent } from './registry';

export default function ArrayField({ field, control }: any) {
  const { t } = useI18n();
  const name = field.name;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Stack spacing={1}>
      {!!field.label && (
        <Typography variant="subtitle2">{t(field.label)}</Typography>
      )}

      {fields.map((row, idx) => {
        const subFields = field.itemSchema ?? field.itemsSchema ?? [];
        const inlineRemove = !!field.inlineRemove;

        return (
          <Grid
            key={row.id}
            container
            spacing={2}
            alignItems="flex-start"
            wrap={inlineRemove ? 'nowrap' : 'wrap'}
          >
            {subFields.map((sub: any) => {
              const xs = sub.grid?.xs ?? 12;
              const sm = sub.grid?.sm ?? xs;
              const md = sub.grid?.md ?? xs;
              const lg = sub.grid?.lg ?? md;

              const Comp = getFieldComponent(sub.type);

              if (typeof Comp !== 'function') {
                console.error('Bad field component:', field.type, Comp);
                return null;
              }

              return (
                <Grid item xs={xs} sm={sm} md={md} lg={lg} key={`${idx}-${sub.name}`}>
                  <Comp
                    field={{
                      ...sub,
                      name: `${name}.${idx}.${sub.name}`,
                      fullWidth: true,
                    }}
                    control={control}
                  />
                </Grid>
              );
            })}

            <Grid item xs={inlineRemove ? 'auto' : 12}>
              <IconButton
                onClick={() => remove(idx)}
                aria-label="remove"
                size="small"
                sx={inlineRemove ? { ml: 1 } : undefined}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Grid>

          </Grid>
        );
      })}

      <Button size="small" onClick={() => append({})}>
        {(field.addText && t(field.addText)) || t('table.labelAddOne')}
      </Button>
    </Stack>
  );
}
