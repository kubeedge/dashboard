import request from "@/utils/request";

export async function getNamespaces(options?: Record<string, any>) {
  return request("/api/v1/namespaces", {
    method: "GET",
    ...(options || {}),
  });
}

export async function getNodes(options?: Record<string, any>) {
  return request("/api/v1/nodes", {
    method: "GET",
    ...(options || {}),
  });
}

export async function getDeviceModels(options?: Record<string, any>) {
  return request(
    "/apis/devices.kubeedge.io/v1alpha2/namespaces/default/devicemodels",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getDeployments(
  namespace?: string,
  options?: Record<string, any>
) {
  return request(
    `/apis/apps/v1${namespace ? `/namespace/${namespace}` : ""}/deployments`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getDevices(
  namespace?: string,
  options?: Record<string, any>
) {
  return request(
    `/apis/devices.kubeedge.io/v1alpha2${
      namespace ? `/namespace/${namespace}` : ""
    }/devices`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

export async function getRules(
  namespace?: string,
  options?: Record<string, any>
) {
  return request(
    `/apis/rules.kubeedge.io/v1${
      namespace ? `/namespace/${namespace}` : ""
    }/rules`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
