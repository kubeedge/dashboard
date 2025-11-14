import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { request } from '@/helper/request';

interface UseQueryOptions<T> extends AxiosRequestConfig<T> {}

const buildKey = (uri: string, params?: any) => {
  if (!params) return null;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort()
    .map(([k, v]) => `${k}:${v}`)
    .join('&')

  return `${uri}?${query}`;
}

export function useQuery<T>(key: string, url: string, opt?: UseQueryOptions<T>) {
  const newKey = buildKey(url, opt?.params);

  const { data, error, isLoading, mutate } = useSWR<T>(
    [newKey],
    async ([key]) => {
      const resp = await request(url, opt as AxiosRequestConfig<T>);

      return resp.data || resp;
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
