import request from '@/utils/request'

export function getList(namespace) {
	return request({
		url: `/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications`,
		method: "get"
	})
}

// 删除
export function removeItem(namespaces, app) {
	return request({
		url: `/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespaces}/edgeapplications/${app}`,
		method: 'delete',
	});
}

// 新增部门
export async function addItem(namespaces, data) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespaces}/edgeapplications`, {
    method: 'POST',
    data,
  });
}