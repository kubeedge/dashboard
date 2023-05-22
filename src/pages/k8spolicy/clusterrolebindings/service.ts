import request from "@/utils/request";
import type { DeptType } from "./data.d";

// 列表
export function getList() {
  return request(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`, {
    method: "get",
  });
}
// 删除
export function removeItem(clusterrolebindings: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${clusterrolebindings}`,
    {
      method: "delete",
    }
  );
}

export function getYaml(clusterrolebindings: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/clusterrolebindings/${clusterrolebindings}`,
    {
      method: "get",
    }
  );
}

export function addBinding(params) {
  return request(`/apis/rbac.authorization.k8s.io/v1/clusterrolebindings`, {
    method: "post",
    data: params,
  });
}
