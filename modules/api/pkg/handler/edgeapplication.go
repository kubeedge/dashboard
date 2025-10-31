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
	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/edgeapplication"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addEdgeApplicationRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication").To(apiHandler.handleGetEdgeApplications).
			Writes(ListResponse[edgeapplication.EdgeApplicationListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[edgeapplication.EdgeApplicationListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication/{namespace}").To(apiHandler.handleGetEdgeApplications).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Writes(ListResponse[edgeapplication.EdgeApplicationListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[edgeapplication.EdgeApplicationListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication/{namespace}/{name}").To(apiHandler.handleGetEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Param(apiV1Ws.PathParameter("name", "Name of the edge application")).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/edgeapplication/{namespace}").To(apiHandler.handleCreateEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Reads(appsv1alpha1.EdgeApplication{}).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusCreated, "Created", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/edgeapplication/{namespace}").To(apiHandler.handleUpdateEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Reads(appsv1alpha1.EdgeApplication{}).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/edgeapplication/{namespace}/{name}").To(apiHandler.handleDeleteEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Param(apiV1Ws.PathParameter("name", "Name of the edge application")).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetEdgeApplications(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	// parse list query
	query, err := ParseListQuery(request, AllowedFields{SortableFields: edgeapplication.SortableFields, FilterableFields: edgeapplication.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	var items []appsv1alpha1.EdgeApplication
	if mockStr := request.QueryParameter("mock"); mockStr != "" { // dev-only hook
		if n, err := strconv.Atoi(mockStr); err == nil && n > 0 {
			items = edgeapplication.GenerateMockEdgeApplications(n, namespace)
		}
	}
	if items == nil {
		rawList, err := edgeapplication.GetEdgeApplicationList(kubeedgeClient, namespace)
		if err != nil {
			errors.HandleInternalError(response, err)
			return
		}
		items = rawList.Items
	}

	items = listutil.FilterItems(items, toCommonFilterClauses(query.Filters), edgeapplication.EdgeApplicationFieldGetter)
	listutil.SortItems(items, query.Sort, query.Order, edgeapplication.EdgeApplicationComparators())
	pageItems, total, _ := listutil.Paginate(items, query.Page, query.PageSize)
	view := listutil.Project(pageItems, edgeapplication.EdgeApplicationToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) handleGetEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := edgeapplication.GetEdgeApplication(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1alpha1.EdgeApplication)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := edgeapplication.CreateEdgeApplication(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1alpha1.EdgeApplication)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := edgeapplication.UpdateEdgeApplication(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = edgeapplication.DeleteEdgeApplication(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
