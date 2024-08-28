import type { ObjectMeta, ResourceList, TypeMeta } from './common';
import type { PodSpec } from './pod';

export interface PodTemplateSepc {
  metadata?: ObjectMeta;
  spec?: PodSpec;
}

export interface PodTemplate extends TypeMeta {
  metadata?: ObjectMeta;
  template?: PodTemplateSepc;
}

export interface PodTemplateList extends ResourceList<PodTemplate> {}
