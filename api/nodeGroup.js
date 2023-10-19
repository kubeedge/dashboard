import request from '@/utils/request'

export function getList() {
	return request({
		url: `/apis/apps.kubeedge.io/v1alpha1/nodegroups`,
		method: "get"
	})
}

// 删除
export function removeItem(app) {
	return request({
		url: `/apis/apps.kubeedge.io/v1alpha1/nodegroups/${app}`,
		method: 'delete',
	});
}

// 新增部门
export async function addItem(data) {
	return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups`, {
		method: 'POST',
		data,
	});
}