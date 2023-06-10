import request from "@/utils/request";

export function getList(namespace: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/configmaps`,
    {
      method: "get",
    }
  );
}

export function getDetail(namespace: string, name: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/configmaps/${name}`,
    {
      method: "get",
    }
  );
}

export async function addConfigmap(namespaces: string, params: any) {
  return request(`/api/v1/namespaces/${namespaces}/configmaps`, {
    method: "POST",
    data: params,
  });
}

export function removeItem(namespaces: string, name: string) {
  return request(`/api/v1/namespaces/${namespaces}/configmaps/${name}`, {
    method: "delete",
  });
}
