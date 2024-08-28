import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { RuleEndpoint, RuleEndpointList } from '@/types/ruleEndpoint';
import { request } from '@/helper/request';

export function useListRuleEndpoints(namespace?: string) {
  const url = namespace ? `/apis/rules.kubeedge.io/v1/namespaces/${namespace}/ruleendpoints` : '/apis/rules.kubeedge.io/v1/ruleendpoints';
  return useQuery<RuleEndpointList>('listRuleEndpoints', url, {
    method: 'GET',
  });
}

export function getRuleEndpoint(namespace: string, name: string) {
  return request<RuleEndpoint>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/ruleendpoints/${name}`, {
    method: 'GET',
  });
}

export function createRuleEndpoint(namespace: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/ruleendpoints`, {
    method: 'POST',
    data,
  });
}

export function updateRuleEndpoint(namespace: string, name: string, data: RuleEndpoint) {
  return request<RuleEndpoint>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/ruleendpoints/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRuleEndpoint(namespace: string, name: string) {
  return request<Status>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/ruleendpoints/${name}`, {
    method: 'DELETE',
  });
}