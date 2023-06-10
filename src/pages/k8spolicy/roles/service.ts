import request from "@/utils/request";
import type { DeptType } from "./data.d";

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1${
      namespace ? `/namespaces/${namespace}` : ""
    }/roles`,
    {
      method: "get",
    }
  );
}

// 删除
export function removeItem(namespaces: string, name: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles/${name}`,
    {
      method: "delete",
    }
  );
}

// 新增
export function addRole(namespaces: string, params) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles`,
    {
      method: "post",
      data: params,
    }
  );
}

// 详情
export function getYaml(namespaces: string, name: string) {
  return request(
    `/apis/rbac.authorization.k8s.io/v1/namespaces/${namespaces}/roles/${name}`,
    {
      method: "get",
    }
  );
}
