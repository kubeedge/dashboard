import request from "@/utils/request";

export function getList(namespace: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/serviceaccounts`,
    {
      method: "get",
    }
  );
}

export function removeItem(namespace: string, account: string) {
  return request(`/api/v1/namespaces/${namespace}/serviceaccounts/${account}`, {
    method: "delete",
  });
}

export function addAccount(namespaces: string, params) {
  return request(`/api/v1/namespaces/${namespaces}/serviceaccounts`, {
    method: "post",
    data: params,
  });
}

export function getYaml(namespace: string, name: string) {
  return request(`/api/v1/namespaces/${namespace}/serviceaccounts/${name}`, {
    method: "get",
  });
}

export function getSecretsList(namespace: string) {
  return request(
    `/api/v1${namespace ? `/namespaces/${namespace}` : ""}/secrets`,
    {
      method: "get",
    }
  );
}
