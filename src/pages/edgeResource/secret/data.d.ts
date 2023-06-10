export type listType = {
  name: string;
  uid: string;
  creationTimestamp: string;
  type: string;
  namespace: string;
};

export type SecretType = {
  kind?: string;
  apiVersion?: string;
  type?: string;
  metadata?: any;
  data?: object;
};
