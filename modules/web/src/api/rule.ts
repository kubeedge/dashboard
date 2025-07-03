import { useQuery } from '@/hook/useQuery';
import { Status } from '@/types/common';
import { Rule, RuleList } from '@/types/rule';
import { request } from '@/helper/request';

export function useListRules(namespace?: string) {
  const url = namespace ? `/rule/${namespace}` : '/rule';
  return useQuery<RuleList>('listRules', url, {
    method: 'GET',
  });
}

export function getRule(namespace: string, name: string) {
  return request<Rule>(`/rule/${namespace}/${name}`, {
    method: 'GET',
  });
}

export function createRule(namespace: string, data: Rule) {
  return request<Rule>(`/rule/${namespace}`, {
    method: 'POST',
    data,
  });
}

export function updateRule(namespace: string, name: string, data: Rule) {
  return request<Rule>(`/rule/${namespace}`, {
    method: 'PUT',
    data,
  });
}

export function deleteRule(namespace: string, name: string) {
  return request<Status>(`/rule/${namespace}/${name}`, {
    method: 'DELETE',
  });
}