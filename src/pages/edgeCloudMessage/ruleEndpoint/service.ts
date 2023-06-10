import request from "@/utils/request";

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/rules.kubeedge.io/v1${
      namespace ? `/namespaces/${namespace}` : ""
    }/ruleendpoints`,
    {
      method: "get",
    }
  );
}

// 删除
export function removeItem(namespaces: string, ruleendpoint: string) {
  return request(
    `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints/${ruleendpoint}`,
    {
      method: "delete",
    }
  );
}

export function addItem(namespaces: string, formType: object) {
  return request(
    `/apis/rules.kubeedge.io/v1/namespaces/${namespaces}/ruleendpoints`,
    {
      method: "post",
      data: formType,
    }
  );
}

export function getYaml(namespace: string, name: string) {
  return request(
    `/apis/rules.kubeedge.io/v1${
      namespace ? `/namespaces/${namespace}` : ""
    }/ruleendpoints/${name}`,
    {
      method: "get",
    }
  );
}
