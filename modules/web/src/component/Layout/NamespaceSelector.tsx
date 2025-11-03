'use client';

import { useListNamespaces } from '@/api/namespace';
import { useNamespace } from '@/hook/useNamespace';
import { MenuItem, Select } from '@mui/material';

export default function NamespaceSelector() {
  const {namespace, setNamespace} = useNamespace();
  const { data: namespaces } = useListNamespaces();

  return (
    <Select
      value={namespace}
      onChange={(e) => setNamespace(e.target.value)}
      variant="standard"
      disableUnderline
      sx={{ color: 'white', mr: 2 }}
    >
      <MenuItem defaultChecked value="">All NameSpace</MenuItem>
      {namespaces?.items.map((ns) => (
        <MenuItem key={ns.metadata?.name} value={ns.metadata?.name}>
          {ns.metadata?.name}
        </MenuItem>
      ))}
    </Select>
  );
}
