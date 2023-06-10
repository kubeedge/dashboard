import request from "@/utils/request";

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/devices.kubeedge.io/v1alpha2${
      namespace ? `/namespaces/${namespace}` : ""
    }/devicemodels`,
    {
      method: "get",
    }
  );
}
export function getListByQuery(namespaces: string, name: string) {
  return request(
    `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels/${name}`,
    {
      method: "get",
    }
  );
}

export function getListByLabel(namespaces: string, formType: object) {
  return request(`/apis/apps/v1/namespaces/${namespaces}/deployments`, {
    method: "get",
    params: formType,
  });
}
// 删除
export function removeItem(namespaces: string, app: string) {
  return request(
    `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels/${app}`,
    {
      method: "delete",
    }
  );
}

export function addItem(namespaces: string, obj: object) {
  return request(
    `/apis/devices.kubeedge.io/v1alpha2/namespaces/${namespaces}/devicemodels`,
    {
      method: "post",
      data: obj,
    }
  );
}
