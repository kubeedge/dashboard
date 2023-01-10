export type formType = {
  remark: string;
  cloudIP: string;
  version: string;
  token: string;
}
export type listType = {
  name: string;
  uid: string;
  creationTimestamp: string;
  group: string;
};
export type JobType = {
  annotations?: any;
  creationTimestamp?: any;
  labels?: any;
  managedFields?: any;
  name?: any;
  resourceVersion?: any;
  selfLink?: any;
  uid?: any;
};
export type metaType = {
  annotations?: any;
  creationTimestamp?: any;
  labels?: any;
  managedFields?: any;
  name?: any;
  resourceVersion?: any;
  selfLink?: any;
  uid?: any;
};
export type DeptType = {
  name: any;
  uid: any;
  hostname: any;
  ip: any;
  delFlag: string;
  createBy: string;
  createTime: Date;
  updateBy: string;
  updateTime: Date;
};

