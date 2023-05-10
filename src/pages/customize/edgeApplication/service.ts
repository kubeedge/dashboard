import { downLoadXlsx } from "@/utils/downloadfile";
import request from "@/utils/request";
import { formatTreeSelectData } from "@/utils/utils";
import type { DataNode } from "antd/lib/tree";
import type { DeptType, DeptListParams } from "./data.d";

// 列表
export function getList(namespace: string) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1${
      namespace ? `/namespaces/${namespace}` : ""
    }/edgeapplications`,
    {
      method: "get",
    }
  );
}
// 删除
export function removeItem(app: string) {
  return request(
    `/apis/apps.kubeedge.io/v1alpha1/namespaces/default/edgeapplications/${app}`,
    {
      method: "delete",
    }
  );
}

// 查询部门详细
export function getDept(deptId: number) {
  return request(`/system/dept/${deptId}`, {
    method: "GET",
  });
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

// 删除部门
export async function removeDept(ids: string) {
  return request(`/system/dept/${ids}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
}

// 导出部门
export function exportDept(params?: DeptListParams) {
  return downLoadXlsx(
    `/system/dept/export`,
    { params },
    `dept_${new Date().getTime()}.xlsx`
  );
}

// 获取数据列表
export function getTreeList(params: any): Promise<DataNode[]> {
  return new Promise((resolve) => {
    const queryString = new URLSearchParams(params).toString();
    request(`/system/dept/treeselect?${queryString}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }).then((res) => {
      if (res && res.code === 200) {
        const treeData = formatTreeSelectData(res.data);
        resolve(treeData);
      } else {
        resolve([]);
      }
    });
  });
}
