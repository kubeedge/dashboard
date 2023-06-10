import request from "@/utils/request";

export function getList() {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups`, {
    method: "get",
  });
}

export function getYaml(name: string) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${name}`, {
    method: "get",
  });
}

export function removeItem(app: string) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups/${app}`, {
    method: "delete",
  });
}

export async function addNodegroup(params: any) {
  return request(`/apis/apps.kubeedge.io/v1alpha1/nodegroups`, {
    method: "POST",
    data: params,
  });
}
