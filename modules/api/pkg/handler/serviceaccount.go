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

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/serviceaccount"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addServiceAccountRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/serviceaccount").To(apiHandler.getServiceAccountList).
			Writes(ListResponse[serviceaccount.ServiceAccountListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[serviceaccount.ServiceAccountListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/serviceaccount/{namespace}").To(apiHandler.getServiceAccountList).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(ListResponse[serviceaccount.ServiceAccountListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[serviceaccount.ServiceAccountListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/serviceaccount/{namespace}/{name}").To(apiHandler.getServiceAccount).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the service account")).
			Writes(corev1.ServiceAccount{}).
			Returns(http.StatusOK, "OK", corev1.ServiceAccount{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/serviceaccount/{namespace}").To(apiHandler.createServiceAccount).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.ServiceAccount{}).
			Writes(corev1.ServiceAccount{}).
			Returns(http.StatusCreated, "Created", corev1.ServiceAccount{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/serviceaccount/{namespace}").To(apiHandler.updateServiceAccount).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.ServiceAccount{}).
			Writes(corev1.ServiceAccount{}).
			Returns(http.StatusOK, "OK", corev1.ServiceAccount{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/serviceaccount/{namespace}/{name}").To(apiHandler.deleteServiceAccount).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the service account")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) getServiceAccountList(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: serviceaccount.SortableFields, FilterableFields: serviceaccount.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	
	rawList, err := serviceaccount.GetServiceAccountList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	items := rawList.Items

	items = common.FilterItems(items, toCommonFilterClauses(query.Filters), serviceaccount.ServiceAccountFieldGetter)
	common.SortItems(items, query.Sort, query.Order, serviceaccount.ServiceAccountComparators())
	pageItems, total, _ := common.Paginate(items, query.Page, query.PageSize)
	view := common.Project(pageItems, serviceaccount.ServiceAccountToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) getServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := serviceaccount.GetServiceAccount(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) createServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.ServiceAccount)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := serviceaccount.CreateServiceAccount(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) updateServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.ServiceAccount)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := serviceaccount.UpdateServiceAccount(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) deleteServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = serviceaccount.DeleteServiceAccount(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
