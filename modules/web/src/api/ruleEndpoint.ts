import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RuleEndpoint, RuleEndpointList } from '@/types/ruleEndpoint';
import { request } from '@/helper/request';

export function useListRuleEndpoints(params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'namespace') {
        searchParams.append(key, value.toString());
      }
    });
  }
  
  const namespace = params?.namespace as string;
  const baseUrl = namespace ? `/ruleendpoint/${namespace}` : '/ruleendpoint';
  const url = searchParams.toString() ? `${baseUrl}?${searchParams.toString()}` : baseUrl;
  
  return useQuery<RuleEndpointList>('listRuleEndpoints', url, {
    method: 'GET',
  });
}

export function getRuleEndpoint(namespace: string, name: string) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRuleEndpoint(namespace: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRuleEndpoint(namespace: string, name: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/ruleendpoint/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRuleEndpoint(namespace: string, name: string) {
  return request<Status>(`/ruleendpoint/${namespace}/${name}`, {
    method: 'DELETE',
  });
}