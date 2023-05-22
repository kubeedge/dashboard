import request from "@/utils/request";

// 列表
export function getList() {
  return request(`/apis/rbac.authorization.k8s.io/v1/clusterroles`, {
    method: "get",
  });
}

// 删除
export function removeItem(clusterrole: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/clusterroles/${clusterrole}`,
    {
      method: "delete",
    }
  );
}

export function getYaml(clusterrole: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/clusterroles/${clusterrole}`,
    {
      method: "get",
    }
  );
}

export function addRole(params) {
  return request(`/apis/rbac.authorization.k8s.io/v1/clusterroles`, {
    method: "post",
    data: params,
  });
}
