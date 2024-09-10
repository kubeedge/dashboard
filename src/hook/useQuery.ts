import useSWR from 'swr';
import { AxiosRequestConfig } from 'axios';
import { request } from '@/helper/request';

export function useQuery<T>(key: string, url: string, opt?: AxiosRequestConfig<T>) {
  const { data, error, isLoading, mutate } = useSWR<T>([key, opt], async ([key, opt]) => {
    const resp = await request(url, opt as AxiosRequestConfig<T>);
    return resp.data;
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
