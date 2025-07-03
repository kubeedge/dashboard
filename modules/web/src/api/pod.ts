import { useQuery } from '@/hook/useQuery';
import { PodList } from '@/types/pod';

export function useListPods(namespace?: string) {
  const url = namespace ? `/pod/${namespace}` : '/pod';

  return useQuery<PodList>('listPods', url, {
    method: 'GET',
  });
}
