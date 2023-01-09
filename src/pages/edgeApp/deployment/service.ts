import request from '@/utils/request';
import type { DeptType } from './data';

export function editYaml(nameSpace, id: string, data: object) {
  return request(`/apis/apps/v1/namespaces/${nameSpace}/deployments/${id}`, {
   method: 'put',
   data
  }) 
}

// 列表
export function getList(namespaces: string) {
 return request(`/apis/apps/v1/namespaces/${namespaces}/deployments`, {
  method: 'get'
 }) 
}
// 删除
export function removeItem(app: string) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${app}`, {
    method: 'delete',
  });
}

// 获取容器应用详情
export function getDeploymentDetail(namespaces: string, name: string) {
  return request(`/apis/apps/v1/namespaces/${namespaces}/deployments/${name}`, {
   method: 'get'
  }) 
}

// 获取实例列表
export function getDeploymentPodsList(namespaces: string) {
  return request(`/api/v1/namespaces/${namespaces}/pods`, {
   method: 'get'
  }) 
}

// 新增部门
export async function addDept(params: DeptType) {
  return request('/system/dept', {
    method: 'POST',
    data: params,
  });
}

// 修改部门
export async function updateDept(params: DeptType) {
  return request('/system/dept', {
    method: 'PUT',
    data: params,
  });
}
