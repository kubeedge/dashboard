import request from "@/utils/request";

export function getList(namespaces: string) {
  return request(`/apis/apiextensions.k8s.io/v1/customresourcedefinitions`, {
    method: "get",
  });
}

export function getYaml(name: string) {
  return request(
    `/apis/apiextensions.k8s.io/v1/customresourcedefinitions/${name}`,
    {
      method: "get",
    }
  );
}
