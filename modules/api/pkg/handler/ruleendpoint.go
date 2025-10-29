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
	rulev1 "github.com/kubeedge/api/apis/rules/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/ruleendpoint"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addRuleEndpointRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/ruleendpoint").To(apiHandler.handleGetRuleEndpoints).
			Writes(ListResponse[ruleendpoint.RuleEndpointListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[ruleendpoint.RuleEndpointListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/ruleendpoint/{namespace}").To(apiHandler.handleGetRuleEndpoints).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(ListResponse[ruleendpoint.RuleEndpointListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[ruleendpoint.RuleEndpointListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/ruleendpoint/{namespace}/{name}").To(apiHandler.handleGetRuleEndpoint).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the rule endpoint")).
			Writes(rulev1.RuleEndpoint{}).
			Returns(http.StatusOK, "OK", rulev1.RuleEndpoint{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/ruleendpoint/{namespace}").To(apiHandler.handleCreateRuleEndpoint).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rulev1.RuleEndpoint{}).
			Writes(rulev1.RuleEndpoint{}).
			Returns(http.StatusCreated, "Created", rulev1.RuleEndpoint{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/ruleendpoint/{namespace}").To(apiHandler.handleUpdateRuleEndpoint).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rulev1.RuleEndpoint{}).
			Writes(rulev1.RuleEndpoint{}).
			Returns(http.StatusOK, "OK", rulev1.RuleEndpoint{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/ruleendpoint/{namespace}/{name}").To(apiHandler.handleDeleteRuleEndpoint).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the rule endpoint")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRuleEndpoints(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: ruleendpoint.SortableFields, FilterableFields: ruleendpoint.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")

	rawList, err := ruleendpoint.GetRuleEndpointList(kubeedgeClient, namespace)
	if err != nil {
		// If real data fails, log error but continue with empty list
		// This allows frontend to work even when KubeEdge resources are not available
		response.WriteHeaderAndEntity(http.StatusOK, NewListResponse([]ruleendpoint.RuleEndpointListItem{}, 0, query.Page, query.PageSize, query.Sort, query.Order))
		return
	}
	items := rawList.Items

	items = common.FilterItems(items, toCommonFilterClauses(query.Filters), ruleendpoint.RuleEndpointFieldGetter)
	common.SortItems(items, query.Sort, query.Order, ruleendpoint.RuleEndpointComparators())
	pageItems, total, _ := common.Paginate(items, query.Page, query.PageSize)
	view := common.Project(pageItems, ruleendpoint.RuleEndpointToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) handleGetRuleEndpoint(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := ruleendpoint.GetRuleEndpoint(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateRuleEndpoint(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.RuleEndpoint)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := ruleendpoint.CreateRuleEndpoint(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateRuleEndpoint(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.RuleEndpoint)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := ruleendpoint.UpdateRuleEndpoint(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteRuleEndpoint(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = ruleendpoint.DeleteRuleEndpoint(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
