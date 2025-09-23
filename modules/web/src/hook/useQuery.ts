import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { request } from '@/helper/request';

interface UseQueryOptions<T> extends AxiosRequestConfig<T> {
  skip?: boolean; // Whether to skip the request
}

export function useQuery<T>(key: string, url: string, opt?: UseQueryOptions<T>) {
  const { skip, ...config } = opt || {};

  const { data, error, isLoading, mutate } = useSWR<T>(
    skip ? null : [key, config],
    async ([key, opt]) => {
      const resp = await request(url, opt as AxiosRequestConfig<T>);

      return resp.data || resp;
    }
  );

  return {
    data,
    error,
    isLoading: skip ? false : isLoading,
    mutate,
  }
}
