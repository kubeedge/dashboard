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
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addRoleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/role").To(apiHandler.handleGetRoles).
			Writes(rbacv1.RoleList{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/role/{namespace}").To(apiHandler.handleGetRoles).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(rbacv1.RoleList{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/role/{namespace}/{name}").To(apiHandler.handleGetRole).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the role")).
			Writes(rbacv1.Role{}).
			Returns(http.StatusOK, "OK", rbacv1.Role{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/role/{namespace}").To(apiHandler.handleCreateRole).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rbacv1.Role{}).
			Writes(rbacv1.Role{}).
			Returns(http.StatusCreated, "Created", rbacv1.Role{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/role/{namespace}").To(apiHandler.handleUpdateRole).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rbacv1.Role{}).
			Writes(rbacv1.Role{}).
			Returns(http.StatusOK, "OK", rbacv1.Role{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/role/{namespace}/{name}").To(apiHandler.handleDeleteRole).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the role")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRoles(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
