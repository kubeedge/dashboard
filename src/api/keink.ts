import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';

export function runKeink() {
  return request<string>(`/keink/run`, {
    baseURL: '',
    method: 'GET',
  });
}

export function useKeinkRunnable() {
  return useQuery<{ ok: boolean }>('isKeinkRunnable', `/keink/check`, {
    baseURL: '',
    method: 'GET',
  });
}
