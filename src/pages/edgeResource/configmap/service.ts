import request from "@/utils/request";
import type { DeptType } from "./data";

// 列表
export function getList(namespace: string) {
  return request(
    `/v1${namespace ? `/namespaces/${namespace}` : ""}/configmaps`,
    {
      method: "get",
    }
  );
}

export function getDetail(namespace: string, name: string) {
  return request(
    `/v1${namespace ? `/namespaces/${namespace}` : ""}/configmaps/${name}`,
    {
      method: "get",
    }
  );
}

// 新增部门
export async function addDept(params: DeptType) {
  return request("/system/dept", {
    method: "POST",
    data: params,
  });
}

// 修改部门
export async function updateDept(params: DeptType) {
  return request("/system/dept", {
    method: "PUT",
    data: params,
  });
}

// 新增
export async function addConfigmap(namespaces: string, params: any) {
  return request(`/v1/namespaces/${namespaces}/configmaps`, {
    method: "POST",
    data: params,
  });
}

// 删除
export function removeItem(namespaces: string, name: string) {
  return request(`/v1/namespaces/${namespaces}/configmaps/${name}`, {
    method: "delete",
  });
}
