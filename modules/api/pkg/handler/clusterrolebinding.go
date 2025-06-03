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

	"github.com/kubeedge/dashboard/api/pkg/resource/clusterrolebinding"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addClusterRoleBindingRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrolebinding").To(apiHandler.handleGetClusterRoleBindings).
			Writes(rbacv1.ClusterRoleBindingList{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBindingList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrolebinding/{name}").To(apiHandler.handleGetClusterRoleBinding).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRoleBinding")).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/clusterrolebinding").To(apiHandler.handleCreateClusterRoleBinding).
			Reads(rbacv1.ClusterRoleBinding{}).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/clusterrolebinding").To(apiHandler.handleUpdateClusterRoleBinding).
			Reads(rbacv1.ClusterRoleBinding{}).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/clusterrolebinding/{name}").To(apiHandler.handleDeleteClusterRoleBinding).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRoleBinding")).
			Returns(http.StatusNoContent, "OK", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetClusterRoleBindings(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.GetClusterRoleBindingList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	result, err := clusterrolebinding.GetClusterRoleBinding(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	clusterRoleBinding := new(rbacv1.ClusterRoleBinding)
	err = request.ReadEntity(&clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.CreateClusterRoleBinding(k8sClient, clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	clusterRoleBinding := new(rbacv1.ClusterRoleBinding)
	err = request.ReadEntity(&clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.UpdateClusterRoleBinding(k8sClient, clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	err = clusterrolebinding.DeleteClusterRoleBinding(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
