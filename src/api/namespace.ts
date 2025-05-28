import { useQuery } from '@/hook/useQuery';
import { NamespaceList } from '@/types/namespace';

export function useListNamespaces() {
  return useQuery<NamespaceList>('listNamespaces', '/namespace', {
    method: 'GET',
  });
}
