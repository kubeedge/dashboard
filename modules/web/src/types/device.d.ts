import type { LocalObjectReference, Resource, ResourceList } from "./common";

interface TwinProperty {
  value: string;
  metadata?: Record<string, string>;
}

interface TDEngineClientConfig {
  addr?: string;
  dbName?: string;
}

interface DBMethodTDEngine {
  TDEngineClientConfig?: TDEngineClientConfig;
}

interface Influxdb2ClientConfig {
  bucket?: string;
  org?: string;
  url?: string;
}

interface Influxdb2DataConfig {
  fieldKey?: string;
  measurement?: string;
  tag?: Record<string, string>;
}

interface DBMethodInfluxdb2 {
  influxdb2ClientConfig?: Influxdb2ClientConfig;
  influxdb2DataConfig?: Influxdb2DataConfig;
}

interface MySQLClientConfig {
  addr?: string;
  database?: string;
  userName?: string;
}

interface DBMethodMySQL {
  mysqlClientConfig?: MySQLClientConfig;
}

interface RedisClientConfig {
  addr?: string;
  db?: number;
  minIdleConns?: number;
  poolsize?: number;
}

interface DBMethodRedis {
  redisClientConfig?: RedisClientConfig;
}

interface DBMethodConfig {
  TDEngine?: DBMethodTDEngine;
  influxdb2?: DBMethodInfluxdb2;
  mysql?: DBMethodMySQL;
  redis?: DBMethodRedis;
}

interface PushMethodHTTP {
  hostName?: string;
  port?: number;
  requestPath?: string;
  timeout?: number;
}

interface PushMethodMQTT {
  address?: string;
  qos?: number;
  retained?: boolean;
  topic?: string;
}

interface PushMethod {
  dbMethod?: DBMethodConfig;
  http?: PushMethodHTTP;
  mqtt?: PushMethodMQTT;
}

interface VisitorConfig {
  configData: any;
  protocolName: string;
}

interface DeviceProperty {
  collectCycle?: number;
  desired?: TwinProperty;
  name: string;
  pushMethod?: PushMethod;
  reportCycle?: number;
  reportToCloud?: boolean;
  visitors?: VisitorConfig;
}

interface ProtocolConfig {
  configData?: any;
  protocolName?: string;
}

interface Twin {
  observedDesired?: TwinProperty;
  propertyName: string;
  reported: TwinProperty;
}

interface DeviceSpec {
  deviceModelRef: LocalObjectReference;
  nodeName?: string;
  properties?: DeviceProperty[];
  protocol?: ProtocolConfig;
}

interface DeviceStatus {
  twins?: Twin[];
}

export interface Device extends Resource<DeviceSpec, DeviceStatus> {}

export interface DeviceList extends ResourceList<Device> {}
