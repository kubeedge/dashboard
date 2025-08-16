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
	"github.com/kubeedge/dashboard/api/pkg/resource/rule"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addRuleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/rule").To(apiHandler.handleGetRules).
			Writes(ListResponse[rule.RuleListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[rule.RuleListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/rule/{namespace}").To(apiHandler.handleGetRules).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(ListResponse[rule.RuleListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[rule.RuleListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/rule/{namespace}/{name}").To(apiHandler.handleGetRule).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the rule")).
			Writes(rulev1.Rule{}).
			Returns(http.StatusOK, "OK", rulev1.Rule{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/rule/{namespace}").To(apiHandler.handleCreateRule).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rulev1.Rule{}).
			Writes(rulev1.Rule{}).
			Returns(http.StatusCreated, "Created", rulev1.Rule{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/rule/{namespace}").To(apiHandler.handleUpdateRule).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rulev1.Rule{}).
			Writes(rulev1.Rule{}).
			Returns(http.StatusOK, "OK", rulev1.Rule{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/rule/{namespace}/{name}").To(apiHandler.handleDeleteRule).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the rule")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRules(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: rule.SortableFields, FilterableFields: rule.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")

	rawList, err := rule.GetRuleList(kubeedgeClient, namespace)
	if err != nil {
		// If real data fails, log error but continue with empty list
		// This allows frontend to work even when KubeEdge resources are not available
		response.WriteHeaderAndEntity(http.StatusOK, NewListResponse([]rule.RuleListItem{}, 0, query.Page, query.PageSize, query.Sort, query.Order))
		return
	}
	items := rawList.Items

	items = common.FilterItems(items, toCommonFilterClauses(query.Filters), rule.RuleFieldGetter)
	common.SortItems(items, query.Sort, query.Order, rule.RuleComparators())
	pageItems, total, _ := common.Paginate(items, query.Page, query.PageSize)
	view := common.Project(pageItems, rule.RuleToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) handleGetRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := rule.GetRule(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.Rule)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := rule.CreateRule(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.Rule)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := rule.UpdateRule(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = rule.DeleteRule(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
