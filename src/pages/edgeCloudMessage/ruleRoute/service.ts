import request from '@/utils/request';
import type { DeptType, formType } from './data.d';

// 列表
export function getList(namespaces: string) {
 return request(`/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules`, {
  method: 'get'
 }) 
}
// 删除
export function removeItem(namespaces: string, app: string) {
  return request(`/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules/${app}`, {
    method: 'delete',
  });
}

export function getNodeList(namespaces: string) {
  return request(`/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints`, {
    method: 'get',
  });
}

export function addItem(namespaces: string, formType: object) {
  return request(`/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules`, {
    method: 'post',
    data: formType
  });
}
