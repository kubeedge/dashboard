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
	appsv1 "k8s.io/api/apps/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/deployment"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addDeploymentRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/deployment").To(apiHandler.handleGetDeployments).
			Writes(appsv1.DeploymentList{}).
			Returns(http.StatusOK, "OK", appsv1.DeploymentList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/deployment/{namespace}").To(apiHandler.handleGetDeployments).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the deployment")).
			Writes(appsv1.DeploymentList{}).
			Returns(http.StatusOK, "OK", appsv1.DeploymentList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/deployment/{namespace}/{name}").To(apiHandler.handleGetDeployment).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the deployment")).
			Param(apiV1Ws.PathParameter("name", "Name of the deployment")).
			Writes(appsv1.Deployment{}).
			Returns(http.StatusOK, "OK", appsv1.Deployment{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/deployment/{namespace}").To(apiHandler.handleCreateDeployment).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the deployment")).
			Reads(appsv1.Deployment{}).
			Writes(appsv1.Deployment{}).
			Returns(http.StatusCreated, "Created", appsv1.Deployment{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/deployment/{namespace}").To(apiHandler.handleUpdateDeployment).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the deployment")).
			Reads(appsv1.Deployment{}).
			Writes(appsv1.Deployment{}).
			Returns(http.StatusOK, "OK", appsv1.Deployment{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/deployment/{namespace}/{name}").To(apiHandler.handleDeleteDeployment).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the deployment")).
			Param(apiV1Ws.PathParameter("name", "Name of the deployment")).
			Writes(appsv1.Deployment{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetDeployments(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := deployment.GetDeploymentList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetDeployment(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := deployment.GetDeployment(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateDeployment(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1.Deployment)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := deployment.CreateDeployment(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateDeployment(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1.Deployment)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := deployment.UpdateDeployment(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteDeployment(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")

	err = deployment.DeleteDeployment(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
