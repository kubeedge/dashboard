import request from "@/utils/request";

export function getList(namespace: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/services`,
    {
      method: "get",
    }
  );
}

export function getDetail(namespace: string, name: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/services/${name}`,
    {
      method: "get",
    }
  );
}

export async function addService(namespaces: string, params: any) {
  return request(`/api/v1/namespaces/${namespaces}/services`, {
    method: "POST",
    data: params,
  });
}

export function removeItem(namespaces: string, name: string) {
  return request(`/api/v1/namespaces/${namespaces}/services/${name}`, {
    method: "delete",
  });
}

export function editYaml(namespaces: string, params: any) {
  return request(`/api/v1/namespaces/${namespaces}/services`, {
    method: "put",
    data: params,
  });
}
