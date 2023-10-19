import request from '@/utils/request'

export function getList() {
  return request('/apis/apiextensions.k8s.io/v1/customresourcedefinitions')
}

export function getYaml(name) {
  return request({
    url: `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${name}`,
    method: 'get',
  });
}