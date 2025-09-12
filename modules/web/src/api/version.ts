import { request } from '@/helper/request';
import { useQuery } from '@/hook/useQuery';

interface KubernetesVersion {
  major: string;
  minor: string;
  gitVersion: string;
  gitCommit: string;
  gitTreeState: string;
  buildDate: string;
  goVersion: string;
  compiler: string;
  platform: string;
}

export function useGetK8sVersion() {
  return useQuery<KubernetesVersion>('getK8sVersion', `/version`, {
    method: 'GET',
  });
}

export function getVersion(token: string) {
  return request<KubernetesVersion>(`/version`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
