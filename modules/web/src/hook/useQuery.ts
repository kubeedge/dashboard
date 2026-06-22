import useSWR, { SWRConfiguration } from 'swr';
import { AxiosRequestConfig } from 'axios';
import { request } from '@/helper/request';
import { useDebounced } from './useDebounced';
import { useRef } from 'react';

interface UseQueryOptions<T> extends AxiosRequestConfig<T> {
  swrConfig?: SWRConfiguration<T, any>;
  debounceMs?: number;
}

const buildKey = (uri: string, params?: any) => {
  if (!params) return uri;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  return `${uri}?${query}`;
}

export function useQuery<T>(key: string, url: string, opt?: UseQueryOptions<T>) {
  const params = useDebounced(opt?.params, opt?.debounceMs);
  const newKey = buildKey(url, params);
  const controllerRef = useRef<AbortController | null>(null);

  const { data, error, isLoading, mutate } = useSWR<T>(
    [newKey],
    async ([key]) => {
      controllerRef.current?.abort();

      const controller = new AbortController();
      controllerRef.current = controller;

      const resp = await request(url, {
        ...(opt || {}),
        signal: controller.signal,
      });

      return resp.data || resp;
    },
    {
      ...opt?.swrConfig,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
