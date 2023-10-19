import request from '@/utils/request'

export function getList(namespaces) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints`,
    method: 'get',
  })
}
// 删除
export function removeItem(namespaces, ruleendpoint) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints/${ruleendpoint}`,
    method: 'delete',
  });
}

export function addItem(namespaces, formType) {
  return request({
    url: `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints`,
    method: 'post',
    data: formType
  });
}