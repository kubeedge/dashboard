import { useQuery } from '@/hook/useQuery';
import { PodList } from '@/types/pod';

export function useListPods(namespace?: string) {
  const url = namespace ? `/api/v1/namespaces/${namespace}/pods` : '/api/v1/pods';

  return useQuery<PodList>('listPods', url, {
    method: 'GET',
  });
}
