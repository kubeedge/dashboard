import request from "@/utils/request";

export function editYaml(nameSpace, id: string, data: object) {
  return request(`/apis/apps/v1/namespaces/${nameSpace}/deployments/${id}`, {
    method: "put",
    data,
  });
}

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/apps/v1${namespace ? `/namespaces/${namespace}` : ""}/deployments`,
    {
      method: "get",
    }
  );
}
// 删除
export function removeItem(app: string) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${app}`, {
    method: "delete",
  });
}

// 获取容器应用详情
export function getDeploymentDetail(namespaces: string, name: string) {
  return request(`/apis/apps/v1/namespaces/${namespaces}/deployments/${name}`, {
    method: "get",
  });
}

// 获取实例列表
export function getDeploymentPodsList(namespace: string) {
  return request(`/api/v1/namespaces/${namespace}/pods`, {
    method: "get",
  });
}

export async function addDeployment(namespaces: string, params: any) {
  return request(
    `/apis/apps/v1/namespaces/${namespaces}/deployments`, // dryRun=All
    {
      method: "POST",
      data: params,
    }
  );
}
