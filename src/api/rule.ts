import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Rule, RuleList } from '@/types/rule';
import { request } from '@/helper/request';

export function useListRules(namespace?: string) {
  const url = namespace ? `/apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules` : '/apis/rules.kubeedge.io/v1/rules';
  return useQuery<RuleList>('listRules', url, {
    method: 'GET',
  });
}

export function getRule(namespace: string, name: string) {
  return request<Rule>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules/${name}`, {
    method: 'GET',
  });
}

export function createRule(namespace: string, data: Rule) {
  return request<Rule>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules`, {
    method: 'POST',
    data,
  });
}

export function updateRule(namespace: string, name: string, data: Rule) {
  return request<Rule>(`/apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules/${name}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRule(namespace: string, name: string) {
  return request<Status>(`apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules/${name}`, {
    method: 'DELETE',
  });
}