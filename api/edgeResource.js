import request from '@/utils/request'

// 查询deployments列表
export function getNodesList() {
  return request({
    url: `/api/v1/nodes`,
    method: 'get'
  })
}

// 删除节点
export async function removeNode(name) {
  return request({
    url: `/api/v1/nodes/${name}`,
    method: 'delete',
  });
}

// 获取节点详情
export function getNodesDetail(id) {
  return request({
    url: `/api/v1/nodes/${id}`,
    method: 'get'
  })
}

export function createNode(data) {
  return request({
    url: `/api/v1/nodes`,
    method: 'post',
    data
  })
}