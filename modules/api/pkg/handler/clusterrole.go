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

	"github.com/kubeedge/dashboard/api/pkg/resource/clusterrole"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addClusterRoleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrole").To(apiHandler.handleGetClusterRoles).
			Writes(rbacv1.ClusterRoleList{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrole/{name}").To(apiHandler.handleGetClusterRole).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRole")).
			Writes(rbacv1.ClusterRole{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRole{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/clusterrole").To(apiHandler.handleCreateClusterRole).
			Reads(rbacv1.ClusterRole{}).
			Writes(rbacv1.ClusterRole{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRole{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/clusterrole").To(apiHandler.handleUpdateClusterRole).
			Reads(rbacv1.ClusterRole{}).
			Writes(rbacv1.ClusterRole{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRole{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/clusterrole/{name}").To(apiHandler.handleDeleteClusterRole).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRole")).
			Returns(http.StatusNoContent, "OK", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetClusterRoles(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	result, err := clusterrole.GetClusterRoleList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetClusterRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	name := request.PathParameter("name")
	result, err := clusterrole.GetClusterRole(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateClusterRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	clusterRole := new(rbacv1.ClusterRole)
	err = request.ReadEntity(&clusterRole)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrole.CreateClusterRole(k8sClient, clusterRole)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateClusterRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	clusterRole := new(rbacv1.ClusterRole)
	err = request.ReadEntity(&clusterRole)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrole.UpdateClusterRole(k8sClient, clusterRole)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteClusterRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	name := request.PathParameter("name")
	err = clusterrole.DeleteClusterRole(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
