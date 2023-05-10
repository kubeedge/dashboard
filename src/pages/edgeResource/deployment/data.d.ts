export type listType = {
  name: string;
  uid: string;
  namespace: string;
  creationTimestamp: string;
  availableReplicas: number;
  unavailableReplicas: number;
  replicas: number;
};

export type podListType = {
  name: string;
  uid: string;
  nodeName: string;
  status: string;
  resources: { cpu: string; memory: string };
  creationTimestamp: string;
  loadingTime: string;
};

export type DeptType = {
  deptId: number;
  parentId: number;
  ancestors: string;
  deptName: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: string;
  delFlag: string;
  createBy: string;
  createTime: Date;
  updateBy: string;
  updateTime: Date;
};

export type depType = {};

export type DeptListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type DeptListData = {
  list: DeptType[];
  pagination: Partial<DeptListPagination>;
};

export type DeptListParams = {
  deptId?: string;
  parentId?: string;
  ancestors?: string;
  deptName?: string;
  orderNum?: string;
  leader?: string;
  phone?: string;
  email?: string;
  status?: string;
  delFlag?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  pageSize?: string;
  currentPage?: string;
  filter?: string;
  sorter?: string;
};
