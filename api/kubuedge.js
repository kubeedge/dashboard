import request from '@/utils/request'

export async function getNamespaces(options) {
  return request({
    url: '/api/v1/namespaces',
    method: 'GET',
    ...(options || {}),
  });
}