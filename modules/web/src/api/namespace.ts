import { useQuery } from '@/hook/useQuery';
import { NamespaceList } from '@/types/namespace';
import { request } from '@/helper/request';

export function useListNamespaces() {
  return useQuery<NamespaceList>('listNamespaces', '/namespace', {
    method: 'GET',
  });
}

export async function listNamespaces() {
  const res = await request<NamespaceList>('/namespace', { method: 'GET' });
  return res;
}
