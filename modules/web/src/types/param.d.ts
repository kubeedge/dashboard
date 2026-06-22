export interface CommonParams {
  pretty?: string;
}

export interface CommonListParams extends CommonParams {
  allowWatchBookmarks?: string;
  continue?: string;
  fieldSelector?: string;
  labelSelector?: string;
  limit?: string;
  resourceVersion?: string;
  resourceVersionMatch?: string;
  sendInitialEvents?: string;
  timeoutSeconds?: string;
  watch?: string;
}

export interface CommonUpsertParams extends CommonParams {
  dryRun?: string;
  fieldManager?: string;
  fieldValidation?: string;
}

export interface CommonPartialUpdateParams extends CommonUpsertParams {
  force?: string;
}

export interface CommonDeleteParams extends CommonParams {
  dryRun?: string;
  force?: string;
  gracePeriodSeconds?: string;
  propagationPolicy?: string;
}
