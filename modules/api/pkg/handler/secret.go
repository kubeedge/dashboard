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
	"github.com/kubeedge/dashboard/api/pkg/resource/secret"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addSecretRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/secret").To(apiHandler.handleGetSecrets).
			Writes(ListResponse[secret.SecretListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[secret.SecretListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/secret/{namespace}").To(apiHandler.handleGetSecrets).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(ListResponse[secret.SecretListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[secret.SecretListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/secret/{namespace}/{name}").To(apiHandler.handleGetSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the secret")).
			Writes(corev1.Secret{}).
			Returns(http.StatusOK, "OK", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/secret/{namespace}").To(apiHandler.handleCreateSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Secret{}).
			Writes(corev1.Secret{}).
			Returns(http.StatusCreated, "Created", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/secret/{namespace}").To(apiHandler.handleUpdateSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Secret{}).
			Writes(corev1.Secret{}).
			Returns(http.StatusOK, "OK", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/secret/{namespace}/{name}").To(apiHandler.handleDeleteSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the secret")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetSecrets(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: secret.SortableFields, FilterableFields: secret.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")

	var items []corev1.Secret
	if mockStr := request.QueryParameter("mock"); mockStr != "" {
		if n, err := strconv.Atoi(mockStr); err == nil && n > 0 {
			items = secret.GenerateMockSecrets(n, namespace)
		}
	}
	if items == nil {
		rawList, err := secret.GetSecretList(k8sClient, namespace)
		if err != nil {
			errors.HandleInternalError(response, err)
			return
		}
		items = rawList.Items
	}

	items = listutil.FilterItems(items, toCommonFilterClauses(query.Filters), secret.SecretFieldGetter)
	listutil.SortItems(items, query.Sort, query.Order, secret.SecretComparators())
	pageItems, total, _ := listutil.Paginate(items, query.Page, query.PageSize)
	view := listutil.Project(pageItems, secret.SecretToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) handleGetSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := secret.GetSecret(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	data := new(corev1.Secret)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := secret.CreateSecret(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	data := new(corev1.Secret)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := secret.UpdateSecret(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = secret.DeleteSecret(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
