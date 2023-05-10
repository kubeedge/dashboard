import request from "@/utils/request";
import type { SecretType } from "./data";

// 列表
export function getList(namespace: string) {
  return request(`/v1${namespace ? `/namespaces/${namespace}` : ""}/secrets`, {
    method: "get",
  });
}

// 详情
export function getInfo(namespaces: string, name: string) {
  return request(`/v1/namespaces/${namespaces}/secrets/${name}`, {
    method: "get",
  });
}

// 删除
export function removeItem(namespaces: string, name: string) {
  return request(`/v1/namespaces/${namespaces}/secrets/${name}`, {
    method: "delete",
  });
}

// 新增
export async function addSecret(namespaces: string, params: SecretType) {
  return request(`/v1/namespaces/${namespaces}/secrets`, {
    method: "POST",
    data: params,
  });
}
