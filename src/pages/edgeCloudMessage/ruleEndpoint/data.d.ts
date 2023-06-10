export type listType = {
  name: string;
  uid: string;
  creationTimestamp: string;
  ruleEndpointType: string;
  namespace: string;
};

export type formType = {
  name: string;
  port: string;
  type: string;
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
