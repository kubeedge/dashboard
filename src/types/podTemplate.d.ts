import type { ObjectMeta, ResourceList, TypeMeta } from './common';
import type { PodSpec } from './pod';

export interface PodTemplateSpec {
  metadata?: ObjectMeta;
  spec?: PodSpec;
}

export interface PodTemplate extends TypeMeta {
  metadata?: ObjectMeta;
  template?: PodTemplateSpec;
}

export interface PodTemplateList extends ResourceList<PodTemplate> {}
