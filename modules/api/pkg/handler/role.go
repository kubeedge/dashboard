/*
Copyright 2025 The KubeEdge Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/role"

	"github.com/kubeedge/dashboard/errors"
)

// --- Routes registration using helper ---
// Replaces the original addRoleRoutes implementation
func (apiHandler *APIHandler) addRoleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	// Reusable path parameters (avoid recreating the same Parameter multiple times)
	nsParam := apiV1Ws.PathParameter("namespace", "Name of the namespace")
	nameParam := apiV1Ws.PathParameter("name", "Name of the role")

	// GET /role -> list all roles (across namespaces)
	AddRoute(apiV1Ws, http.MethodGet, "/role", apiHandler.handleGetRoles,
		WithWrites(rbacv1.RoleList{}),
		WithReturns(http.StatusOK, "OK", rbacv1.RoleList{}),
		WithDoc("Get all roles"))

	// GET /role/{namespace} -> list roles in a namespace
	AddRoute(apiV1Ws, http.MethodGet, "/role/{namespace}", apiHandler.handleGetRoles,
		WithParam(nsParam),
		WithWrites(rbacv1.RoleList{}),
		WithReturns(http.StatusOK, "OK", rbacv1.RoleList{}),
		WithDoc("Get roles in a namespace"))

	// GET /role/{namespace}/{name} -> get a specific role
	AddRoute(apiV1Ws, http.MethodGet, "/role/{namespace}/{name}", apiHandler.handleGetRole,
		WithParam(nsParam),
		WithParam(nameParam),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusOK, "OK", rbacv1.Role{}),
		WithDoc("Get a role by name"))

	// POST /role/{namespace} -> create a new role
	AddRoute(apiV1Ws, http.MethodPost, "/role/{namespace}", apiHandler.handleCreateRole,
		WithParam(nsParam),
		WithReads(rbacv1.Role{}),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusCreated, "Created", rbacv1.Role{}),
		WithDoc("Create a role in a namespace"))

	// PUT /role/{namespace} -> update a role (keep original path behavior)
	AddRoute(apiV1Ws, http.MethodPut, "/role/{namespace}", apiHandler.handleUpdateRole,
		WithParam(nsParam),
		WithReads(rbacv1.Role{}),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusOK, "OK", rbacv1.Role{}),
		WithDoc("Update a role in a namespace"))

	// DELETE /role/{namespace}/{name} -> delete a role
	AddRoute(apiV1Ws, http.MethodDelete, "/role/{namespace}/{name}", apiHandler.handleDeleteRole,
		WithParam(nsParam),
		WithParam(nameParam),
		WithReturns(http.StatusNoContent, "No Content", nil),
		WithDoc("Delete a role"))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRoles(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := role.GetRoleList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := role.GetRole(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.Role)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := role.CreateRole(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.Role)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := role.UpdateRole(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = role.DeleteRole(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
