'use client';

import { useListNamespaces } from '@/api/namespace';
import { useI18n } from '@/hook/useI18n';
import { useNamespace } from '@/hook/useNamespace';
import { MenuItem, Select } from '@mui/material';

export default function NamespaceSelector() {
  const { namespace, setNamespace } = useNamespace();
  const { data: namespaces } = useListNamespaces();
  const { t } = useI18n();

  return (
    <Select
      value={namespace || ''}
      onChange={(e) => setNamespace(e.target.value)}
      variant="standard"
      disableUnderline
      displayEmpty
      sx={{ color: 'white', mr: 2 }}
    >
      <MenuItem key={'all-namespace'} value={''}>{t('common.allNamespaces')}</MenuItem>
      {namespaces?.items.map((ns) => (
        <MenuItem key={ns.metadata?.name} value={ns.metadata?.name}>
          {ns.metadata?.name}
        </MenuItem>
      ))}
    </Select>
  );
}
