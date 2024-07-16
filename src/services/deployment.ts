import type { DeploymentList } from "@/models/deployment";
import request from "@/utils/request";

export function listDeployments(namespace: string, params?: any) {
  return request<DeploymentList>(
    `/apis/apps/v1${namespace ? `/namespaces/${namespace}` : ""}/deployments`,
    {
      method: "GET",
      params,
    }
  );
}
