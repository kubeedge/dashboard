import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules`,
    method: 'get',
  })
}
// 删除
export function removeItem(namespaces, app) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules/${app}`,
    method: 'delete',
  });
}

export function getNodeList(namespaces) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints`,
    method: 'get',
  });
}

export function addItem(namespaces, formType) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules`,
    method: 'post',
    data: formType
  });
}