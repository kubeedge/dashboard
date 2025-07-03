import type { Condition, Resource, ResourceList } from './common';

interface CustomResourceDefinitionNames {
  kind: string;
  plural: string;
  categories?: string[];
  listKind?: string;
  shortNames?: string[];
  singular?: string;
}

interface CustomResourceColumnDefinition {
  jsonPath: string;
  name: string;
  type: string;
  description?: string;
  format?: string;
  priority?: number;
}

interface ExternalDocumentation {
  description?: string;
  url?: string;
}

interface ValidationRule {
  rule: string;
  fieldPath?: string;
  message?: string;
  messageExpression?: string;
  reason?: string;
}

interface JSONSchemaProps {
  $ref?: string;
  $schema?: string;
  additionalItems?: JSONSchemaProps | boolean;
  additionalProperties?: JSONSchemaProps | boolean;
  allOf?: JSONSchemaProps[];
  anyOf?: JSONSchemaProps[];
  default?: JSON;
  definitions?: Record<string, JSONSchemaProps>
  dependencies?: Record<string, JSONSchemaProps | string[]>
  description?: string;
  enum?: JSON[];
  example?: JSON;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  externalDocs?: ExternalDocumentation;
  format?: string;
  id?: string;
  items?: JSONSchemaProps | JSONSchemaProps[];
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  minimum?: number;
  multipleOf?: number;
  not?: JSONSchemaProps
  nullable?: boolean
  oneOf?: JSONSchemaProps[];
  pattern?: string;
  patternProperties?: Record<string, JSONSchemaProps>
  properties?: Record<string, JSONSchemaProps>
  required?: string[];
  title?: string;
  type?: string;
  uniqueItems?: boolean;
  'x-kubernetes-embedded-resource'?: boolean;
  'x-kubernetes-int-or-string'?: boolean;
  'x-kubernetes-list-map-keys'?: string[];
  'x-kubernetes-list-type'?: string;
  'x-kubernetes-map-type'?: string;
  'x-kubernetes-preserve-unknown-fields'?: boolean;
  'x-kubernetes-validations'?: ValidationRule[];
}

interface CustomResourceValidation {
  openAPIV3Schema?: JSONSchemaProps;
}

interface CustomResourceSubresourceScale {
  specReplicasPath: string;
  statusReplicasPath: string;
  labelSelectorPath?: string;
}

interface CustomResourceSubresources {
  scale?: CustomResourceSubresourceScale;
  status?: string;
}

interface CustomResourceDefinitionVersion {
  name: string;
  served: boolean;
  storage: boolean;
  additionalPrinterColumns?: CustomResourceColumnDefinition[];
  deprecated?: boolean;
  deprecationWarning?: string;
  schema?: CustomResourceValidation;
  subresources?: CustomResourceSubresources;
}

interface ServiceReference {
  name: string;
  namespace: string;
  path?: string;
  port?: number;
}

interface WebhookClientConfig {
  caBundle?: any; // []byte
  service?: ServiceReference;
  url?: string;
}

interface WebhookConversion {
  conversionReviewVersions: string[];
  clientConfig?: WebhookClientConfig;
}

interface CustomResourceConversion {
  strategy: string;
  webhook?: WebhookConversion;
}

interface CustomResourceDefinitionCondition extends Condition {}

interface CustomResourceDefinitionSpec {
  group: string;
  names: CustomResourceDefinitionNames;
  scope: string;
  versions: CustomResourceDefinitionVersion[];
  conversion?: CustomResourceConversion;
  preserveUnknownFields?: boolean;
}

interface CustomResourceDefinitionStatus {
  acceptedNames?: CustomResourceDefinitionNames;
  conditions?: CustomResourceDefinitionCondition[];
  storedVersions?: string[];
}

export interface CustomResourceDefinition extends Resource<
    CustomResourceDefinitionSpec,
    CustomResourceDefinitionStatus
> {
  spec: CustomResourceDefinitionSpec;
}

export interface CustomResourceDefinitionList extends ResourceList<CustomResourceDefinition> {}
