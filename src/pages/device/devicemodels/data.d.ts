export type listType = {
  name: string;
  uid?: string;
  creationTimestamp: string;
  protocol?: string;
  namespace?: string;
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

export type formType = {
  name: string;
  type: string;
  descriptions: string;
  protocol: string;
  propertiesName: string;
}