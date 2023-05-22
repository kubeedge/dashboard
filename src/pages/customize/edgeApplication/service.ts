import request from "@/utils/request";

export function getList(namespace: string) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1${
      namespace ? `/namespaces/${namespace}` : ""
    }/edgeapplications`,
    {
      method: "get",
    }
  );
}

export function removeItem(namespace: string, app: string) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications/${app}`,
    {
      method: "delete",
    }
  );
}

export function getYaml(namespace: string, name: string) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1${
      namespace ? `/namespaces/${namespace}` : ""
    }/edgeapplications/${name}`,
    {
      method: "get",
    }
  );
}

export async function addEdgeapplication(namespace: string, params: any) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1/namespaces/${namespace}/edgeapplications`,
    {
      method: "POST",
      data: params,
    }
  );
}
