import { downLoadXlsx } from '@/utils/downloadfile';
import request from '@/utils/request';
import { formatTreeSelectData } from '@/utils/utils';
import type { DataNode } from 'antd/lib/tree';
import type { DeptType, DeptListParams } from './data';


// 查询deployments列表
export function getNodesList() {
 return request(`/v1/nodes`, {
  method: 'get'
 }) 
}
// 获取节点详情
export function getNodesDetail(id: string) {
  return request(`/v1/nodes/${id}`, {
   method: 'get'
  }) 
}

export function editYaml(id: string, data: object) {
  return request(`/v1/nodes/${id}`, {
   method: 'put',
   data
  }) 
}

// 删除节点
export async function removeNode(name: string) {
  return request(`/v1/nodes/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
