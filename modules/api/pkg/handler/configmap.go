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
	corev1 "k8s.io/api/core/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/configmap"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addConfigMapRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/configmap").To(apiHandler.handleGetConfigMaps).
			Writes(corev1.ConfigMapList{}).
			Returns(http.StatusOK, "OK", corev1.ConfigMapList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/configmap/{namespace}").To(apiHandler.handleGetConfigMaps).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Writes(corev1.ConfigMapList{}).
			Returns(http.StatusOK, "OK", corev1.ConfigMapList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/configmap/{namespace}/{name}").To(apiHandler.handleGetConfigMap).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Param(apiV1Ws.PathParameter("name", "Name of the ConfigMap")).
			Writes(corev1.ConfigMap{}).
			Returns(http.StatusOK, "OK", corev1.ConfigMap{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/configmap/{namespace}").To(apiHandler.handleCreateConfigMap).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Reads(corev1.ConfigMap{}).
			Writes(corev1.ConfigMap{}).
			Returns(http.StatusCreated, "Created", corev1.ConfigMap{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/configmap/{namespace}").To(apiHandler.handleUpdateConfigMap).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Reads(corev1.ConfigMap{}).
			Writes(corev1.ConfigMap{}).
			Returns(http.StatusOK, "OK", corev1.ConfigMap{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/configmap/{namespace}/{name}").To(apiHandler.handleDeleteConfigMap).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Param(apiV1Ws.PathParameter("name", "Name of the ConfigMap")).
			Writes(corev1.ConfigMap{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetConfigMaps(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	result, err := configmap.GetConfigMapList(k8sClient, request.PathParameter("namespace"))
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetConfigMap(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")

	result, err := configmap.GetConfigMap(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateConfigMap(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	configMap := new(corev1.ConfigMap)
	if err := request.ReadEntity(configMap); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := configmap.CreateConfigMap(k8sClient, namespace, configMap)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateConfigMap(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	configMap := new(corev1.ConfigMap)
	if err := request.ReadEntity(configMap); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := configmap.UpdateConfigMap(k8sClient, namespace, configMap)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteConfigMap(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")

	err = configmap.DeleteConfigMap(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
