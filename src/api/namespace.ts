import { useQuery } from '@/hook/useQuery';
import { NamespaceList } from '@/types/namespace';

export function useListNamespaces() {
  return useQuery<NamespaceList>('listNamespaces', '/api/v1/namespaces', {
    method: 'GET',
  });
}
