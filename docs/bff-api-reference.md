# Dashboard BFF API Reference

## Overview

The KubeEdge Dashboard backend acts as a Backend for Frontend (BFF) layer between the web UI and the Kubernetes/KubeEdge cluster. The web UI calls Dashboard APIs, and the BFF layer uses Kubernetes and KubeEdge clients to query or mutate cluster resources.

The BFF layer is implemented mainly in:

- `modules/api`: HTTP API server and resource handlers.
- `modules/common/client`: Kubernetes, API extension, and KubeEdge client initialization.
- `modules/api/pkg/resource`: resource access and object transformation logic.

The API base path is:

```text
/api/v1
```

The current BFF server registers 99 HTTP routes, covering Kubernetes native resources, KubeEdge resources, RBAC resources, CRD query APIs, version query APIs, and Keink installation APIs.

## Responsibilities

The BFF layer provides the following capabilities:

- Cluster connection: connect to the target Kubernetes API server through in-cluster config, kubeconfig, or an explicit API server address.
- Authentication passthrough: read the bearer token from the request and use it to build Kubernetes client credentials.
- Kubernetes resource management: expose Dashboard-friendly APIs for Kubernetes native resources.
- KubeEdge resource management: expose APIs for KubeEdge CRDs such as devices, device models, edge applications, node groups, rules, and rule endpoints.
- Data transformation: convert Kubernetes and KubeEdge resource objects into response DTOs that are easier for the frontend to consume.
- List query processing: support pagination, filtering, sorting, and consistent list responses.
- Unified API routing: provide resource APIs under `/api/v1` and installation-related Keink APIs under `/keink`.

## Authentication

Most APIs require a Kubernetes bearer token:

```http
Authorization: Bearer <token>
```

The BFF layer extracts the token from the request header, builds a Kubernetes REST config, and sends the request to the Kubernetes API server with that token. Authorization is still controlled by Kubernetes RBAC.

## Cluster Connection

The backend can connect to a cluster through:

- In-cluster config, when the backend runs inside a Kubernetes cluster.
- `--kubeconfig`, when a kubeconfig file is provided.
- `--apiserver-host`, when a Kubernetes API server address is provided.
- `--apiserver-skip-tls-verify`, when TLS verification should be skipped for the API server connection.

## Common List Query Parameters

List APIs generally support the following query parameters:

| Parameter | Description | Default |
| --- | --- | --- |
| `page` | Page number. Must be greater than or equal to 1. | `1` |
| `pageSize` | Number of items per page. Must be between 1 and 200. | `20` |
| `sort` | Field used for sorting. The allowed fields depend on each resource. | Empty |
| `order` | Sort order. Supported values: `asc`, `desc`. | `desc` when `sort` is set |
| `filter` | Filter expression. Format: `field:value`. Multiple filters are separated by commas. | Empty |

Filter modes:

| Syntax | Mode | Example |
| --- | --- | --- |
| `field:value` | Exact match | `filter=name:edge-node-1` |
| `field:value*` | Prefix match | `filter=name:edge*` |
| `field:*value` | Suffix match | `filter=name:*node` |
| `field:*value*` | Contains match | `filter=name:*edge*` |

Example:

```http
GET /api/v1/node?page=1&pageSize=20&sort=name&order=asc&filter=status:Ready
Authorization: Bearer <token>
```

## Common List Response

List APIs return a consistent response structure:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "hasNext": true,
  "sort": "name",
  "order": "asc"
}
```

| Field | Description |
| --- | --- |
| `items` | Current page items. |
| `total` | Total number of items after filtering. |
| `page` | Current page number. |
| `pageSize` | Current page size. |
| `hasNext` | Whether a next page exists. |
| `sort` | Current sort field, if specified. |
| `order` | Current sort order, if specified. |

## Kubernetes Resource APIs

### Namespace

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/namespace` | List namespaces. |

### Node

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/node` | List nodes. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/node/{name}` | Get node detail by name. |
| PUT | `/api/v1/node` | Update a node. |
| DELETE | `/api/v1/node/{name}` | Delete a node by name. |

### Pod

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/pod` | List pods across all namespaces. |
| GET | `/api/v1/pod/{namespace}` | List pods in a namespace. |

### Deployment

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/deployment` | List deployments across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/deployment/{namespace}` | List deployments in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/deployment/{namespace}/{name}` | Get deployment detail. |
| POST | `/api/v1/deployment/{namespace}` | Create a deployment in a namespace. |
| PUT | `/api/v1/deployment/{namespace}` | Update a deployment in a namespace. |
| DELETE | `/api/v1/deployment/{namespace}/{name}` | Delete a deployment. |

### ConfigMap

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/configmap` | List config maps across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/configmap/{namespace}` | List config maps in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/configmap/{namespace}/{name}` | Get config map detail. |
| POST | `/api/v1/configmap/{namespace}` | Create a config map in a namespace. |
| PUT | `/api/v1/configmap/{namespace}` | Update a config map in a namespace. |
| DELETE | `/api/v1/configmap/{namespace}/{name}` | Delete a config map. |

### Secret

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/secret` | List secrets across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/secret/{namespace}` | List secrets in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/secret/{namespace}/{name}` | Get secret detail. |
| POST | `/api/v1/secret/{namespace}` | Create a secret in a namespace. |
| PUT | `/api/v1/secret/{namespace}` | Update a secret in a namespace. |
| DELETE | `/api/v1/secret/{namespace}/{name}` | Delete a secret. |

### Service

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/service` | List services across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/service/{namespace}` | List services in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/service/{namespace}/{name}` | Get service detail. |
| POST | `/api/v1/service/{namespace}` | Create a service in a namespace. |
| PUT | `/api/v1/service/{namespace}` | Update a service in a namespace. |
| DELETE | `/api/v1/service/{namespace}/{name}` | Delete a service. |

## RBAC Resource APIs

### ServiceAccount

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/serviceaccount` | List service accounts across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/serviceaccount/{namespace}` | List service accounts in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/serviceaccount/{namespace}/{name}` | Get service account detail. |
| POST | `/api/v1/serviceaccount/{namespace}` | Create a service account in a namespace. |
| PUT | `/api/v1/serviceaccount/{namespace}` | Update a service account in a namespace. |
| DELETE | `/api/v1/serviceaccount/{namespace}/{name}` | Delete a service account. |

### Role

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/role` | List roles across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/role/{namespace}` | List roles in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/role/{namespace}/{name}` | Get role detail. |
| POST | `/api/v1/role/{namespace}` | Create a role in a namespace. |
| PUT | `/api/v1/role/{namespace}` | Update a role in a namespace. |
| DELETE | `/api/v1/role/{namespace}/{name}` | Delete a role. |

### RoleBinding

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/rolebinding` | List role bindings across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/rolebinding/{namespace}` | List role bindings in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/rolebinding/{namespace}/{name}` | Get role binding detail. |
| POST | `/api/v1/rolebinding/{namespace}` | Create a role binding in a namespace. |
| PUT | `/api/v1/rolebinding/{namespace}` | Update a role binding in a namespace. |
| DELETE | `/api/v1/rolebinding/{namespace}/{name}` | Delete a role binding. |

### ClusterRole

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/clusterrole` | List cluster roles. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/clusterrole/{name}` | Get cluster role detail. |
| POST | `/api/v1/clusterrole` | Create a cluster role. |
| PUT | `/api/v1/clusterrole` | Update a cluster role. |
| DELETE | `/api/v1/clusterrole/{name}` | Delete a cluster role. |

### ClusterRoleBinding

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/clusterrolebinding` | List cluster role bindings. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/clusterrolebinding/{name}` | Get cluster role binding detail. |
| POST | `/api/v1/clusterrolebinding` | Create a cluster role binding. |
| PUT | `/api/v1/clusterrolebinding` | Update a cluster role binding. |
| DELETE | `/api/v1/clusterrolebinding/{name}` | Delete a cluster role binding. |

## KubeEdge Resource APIs

### Device

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/device` | List devices across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/device/{namespace}` | List devices in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/device/{namespace}/{name}` | Get device detail. |
| POST | `/api/v1/device/{namespace}` | Create a device in a namespace. |
| PUT | `/api/v1/device/{namespace}` | Update a device in a namespace. |
| DELETE | `/api/v1/device/{namespace}/{name}` | Delete a device. |

### DeviceModel

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/devicemodel` | List device models across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/devicemodel/{namespace}` | List device models in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/devicemodel/{namespace}/{name}` | Get device model detail. |
| POST | `/api/v1/devicemodel/{namespace}` | Create a device model in a namespace. |
| PUT | `/api/v1/devicemodel/{namespace}` | Update a device model in a namespace. |
| DELETE | `/api/v1/devicemodel/{namespace}/{name}` | Delete a device model. |

### EdgeApplication

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/edgeapplication` | List edge applications across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/edgeapplication/{namespace}` | List edge applications in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/edgeapplication/{namespace}/{name}` | Get edge application detail. |
| POST | `/api/v1/edgeapplication/{namespace}` | Create an edge application in a namespace. |
| PUT | `/api/v1/edgeapplication/{namespace}` | Update an edge application in a namespace. |
| DELETE | `/api/v1/edgeapplication/{namespace}/{name}` | Delete an edge application. |

### NodeGroup

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/nodegroup` | List node groups. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/nodegroup/{name}` | Get node group detail. |
| POST | `/api/v1/nodegroup` | Create a node group. |
| PUT | `/api/v1/nodegroup` | Update a node group. |
| DELETE | `/api/v1/nodegroup/{name}` | Delete a node group. |

### Rule

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/rule` | List rules across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/rule/{namespace}` | List rules in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/rule/{namespace}/{name}` | Get rule detail. |
| POST | `/api/v1/rule/{namespace}` | Create a rule in a namespace. |
| PUT | `/api/v1/rule/{namespace}` | Update a rule in a namespace. |
| DELETE | `/api/v1/rule/{namespace}/{name}` | Delete a rule. |

### RuleEndpoint

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/ruleendpoint` | List rule endpoints across all namespaces. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/ruleendpoint/{namespace}` | List rule endpoints in a namespace. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/ruleendpoint/{namespace}/{name}` | Get rule endpoint detail. |
| POST | `/api/v1/ruleendpoint/{namespace}` | Create a rule endpoint in a namespace. |
| PUT | `/api/v1/ruleendpoint/{namespace}` | Update a rule endpoint in a namespace. |
| DELETE | `/api/v1/ruleendpoint/{namespace}/{name}` | Delete a rule endpoint. |

## CRD and System APIs

### CustomResourceDefinition

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/crd` | List custom resource definitions. Supports pagination, filtering, and sorting. |
| GET | `/api/v1/crd/{name}` | Get custom resource definition detail. |

### Version

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/version` | Get Kubernetes server version information. |

## Keink APIs

Keink APIs are not mounted under `/api/v1`.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/keink/check` | Check whether the current environment can run Keink. |
| GET | `/keink/run` | Run Keink and stream installation output through server-sent events. |

## Endpoint Summary

| Category | Route Count | Resources |
| --- | ---: | --- |
| Kubernetes basic resources | 13 | Namespace, Node, Pod, Deployment |
| Kubernetes config and service resources | 18 | ConfigMap, Secret, Service |
| RBAC resources | 28 | ServiceAccount, Role, RoleBinding, ClusterRole, ClusterRoleBinding |
| KubeEdge resources | 35 | Device, DeviceModel, EdgeApplication, NodeGroup, Rule, RuleEndpoint |
| CRD and system APIs | 3 | CustomResourceDefinition, Version |
| Keink APIs | 2 | Keink check and run |
| Total | 99 | Registered HTTP routes |

## Notes

- Create and update APIs generally accept the corresponding Kubernetes or KubeEdge resource object in the request body.
- Delete APIs return success when the target resource is deleted by the Kubernetes API server.
- The allowed sort and filter fields are resource-specific and are defined in the corresponding resource transformation files under `modules/api/pkg/resource`.
- This document describes the routes currently registered by the Dashboard BFF layer. It does not define a new API proposal.
