import request from '@/utils/request';
import type { DeptType } from './data.d';

// 列表
export function getList(namespaces: string) {
 return request(`/v1/namespaces/${namespaces}/serviceaccounts`, {
  method: 'get'
 }) 
}
// 删除
export function removeItem(account: string) {
  return request(`/v1/namespaces/default/serviceaccounts/${account}`, {
    method: 'delete',
  });
}

// 新增
export function addAccount(namespaces: string, params) {
  return request(`/v1/namespaces/${namespaces}/serviceaccounts`, {
   method: 'post',
   data: params
  }) 
}

// 获取秘钥列表
export function getSecretsList(namespaces: string) {
  return request(`/v1/namespaces/${namespaces}/secrets`, {
   method: 'get'
  }) 
}
