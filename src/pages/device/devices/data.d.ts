export type listType = {
  name: string;
  uid: string;
  creationTimestamp: string;
  protocol: string;
  node: string;
};

export type DeviceType = {
  metadata?: object,
  kind?: string,
  spec?: object,
  status?: object,
};