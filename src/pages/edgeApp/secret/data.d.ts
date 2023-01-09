export type listType = {
  name: string;
  uid: string;
  creationTimestamp: string;
  type: string;
};

export type SecretType = {
  kind?: string;
  apiVersion?: string;
  type?: string;
  metadata?: object;
  data?: object;
};
