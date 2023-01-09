import request from '@/utils/request';
import type { DeptType } from './data.d';

// 列表
export function getList() {
 return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups`, {
  method: 'get'
 }) 
}
// 删除
export function removeItem(app: string) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${app}`, {
    method: 'delete',
  });
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
