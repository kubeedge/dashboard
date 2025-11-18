import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';
import { NamespaceList } from '@/types/namespace';

export function useListNamespaces() {
  return useQuery<NamespaceList>(
    'listNamespaces',
    '/namespace',
    { method: 'GET', swrConfig: { refreshInterval: 10000 } });
}

export async function listNamespaces() {
  const res = await request<NamespaceList>('/namespace', { method: 'GET' });
  return res;
}
