import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Deployment, DeploymentList } from '@/types/deployment';
import { request } from '@/helper/request';


export function useListDeployments(namespace?: string) {
  const url = namespace ? `/apis/apps/v1/namespaces/${namespace}/deployments` : '/apis/apps/v1/deployments'
  return useQuery<DeploymentList>('listDeployments', url, {
    method: 'GET',
  });
}

export function getDeployment(namespace: string, name: string) {
  return request<Deployment>(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
    method: 'GET',
  });
}

export function createDeployment(namespace: string, data: Deployment) {
  return request<Deployment>(`/apis/apps/v1/namespaces/${namespace}/deployments`, {
    method: 'POST',
    data,
  });
}

export function updateDeployment(namespace: string, name: string, data: Deployment) {
  return request<Deployment>(`/apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteDeployment(namespace: string, name: string) {
  return request<Status>(`apis/apps/v1/namespaces/${namespace}/deployments/${name}`, {
    method: 'DELETE',
  });
}
