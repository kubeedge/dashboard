import request from '@/utils/request';
import type { DeptType } from './data.d';

// 列表
export function getList(namespaces: string) {
 return request(`/apis/apiextensions.k8s.io/v1/customresourcedefinitions`, {
  method: 'get'
 }) 
}
// 删除
export function getYaml(name: string) {
  return request(`/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${name}`, {
    method: 'get',
  });
}

