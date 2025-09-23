'use client';

import { MenuItem, Select } from '@mui/material';
import { useState } from 'react';

const namespaces = [
  'All NameSpace',
  'default',
  'kube-flannel',
  'kube-node-lease',
  'kube-public',
  'kube-system',
  'kubeedge',
  'kubesphere-controls-system',
  'kubesphere-system',
  'sedna',
];

export default function NamespaceSelector() {
  const [namespace, setNamespace] = useState('All NameSpace');

  return (
    <Select
      value={namespace}
      onChange={(e) => setNamespace(e.target.value)}
      variant="standard"
      disableUnderline
      sx={{ color: 'white', mr: 2 }}
    >
      {namespaces.map((ns) => (
        <MenuItem key={ns} value={ns}>
          {ns}
        </MenuItem>
      ))}
    </Select>
  );
}
