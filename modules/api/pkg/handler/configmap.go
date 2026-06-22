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
	"strconv"

	"github.com/emicklei/go-restful/v3"
	corev1 "k8s.io/api/core/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/configmap"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addConfigMapRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/configmap").To(apiHandler.handleGetConfigMaps).
			Writes(ListResponse[configmap.ConfigMapListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[configmap.ConfigMapListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/configmap/{namespace}").To(apiHandler.handleGetConfigMaps).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the ConfigMap")).
			Writes(ListResponse[configmap.ConfigMapListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[configmap.ConfigMapListItem]{}))
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

	query, err := ParseListQuery(request, AllowedFields{SortableFields: configmap.SortableFields, FilterableFields: configmap.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")

	var items []corev1.ConfigMap
	if mockStr := request.QueryParameter("mock"); mockStr != "" {
		if n, err := strconv.Atoi(mockStr); err == nil && n > 0 {
			items = configmap.GenerateMockConfigMaps(n, namespace)
		}
	}
	if items == nil {
		rawList, err := configmap.GetConfigMapList(k8sClient, namespace)
		if err != nil {
			errors.HandleInternalError(response, err)
			return
		}
		items = rawList.Items
	}

	items = listutil.FilterItems(items, toCommonFilterClauses(query.Filters), configmap.ConfigMapFieldGetter)
	listutil.SortItems(items, query.Sort, query.Order, configmap.ConfigMapComparators())
	pageItems, total, _ := listutil.Paginate(items, query.Page, query.PageSize)
	view := listutil.Project(pageItems, configmap.ConfigMapToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
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
