import request from "@/utils/request";
import type { DeptType, formType } from "./data";

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/rules.kubeedge.io/v1${
      namespace ? `/namespaces/${namespace}` : ""
    }/rules`,
    {
      method: "get",
    }
  );
}
// 删除
export function removeItem(namespaces: string, app: string) {
  return request(
    `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules/${app}`,
    {
      method: "delete",
    }
  );
}

export function getRuleendpoints(namespace: string) {
  return request(
    `/apis/rules.kubeedge.io/v1${
      namespace ? `/namespaces/${namespace}` : ""
    }/ruleendpoints`,
    {
      method: "get",
    }
  );
}

export function addItem(namespaces: string, formType: object) {
  return request(`/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/rules`, {
    method: "post",
    data: formType,
  });
}

export function getYaml(namespace: string, name: string) {
  return request(
    `/apis/rules.kubeedge.io/v1/namespaces/${namespace}/rules/${name}`,
    {
      method: "get",
    }
  );
}
