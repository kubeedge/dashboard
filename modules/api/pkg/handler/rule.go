package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	rulev1 "github.com/kubeedge/api/apis/rules/v1"
	"github.com/kubeedge/dashboard/api/pkg/resource/rule"
	"github.com/kubeedge/dashboard/client"
)

func (apiHandler *APIHandler) addRuleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/rule").To(apiHandler.handleGetRules).
			Writes(rulev1.RuleList{}).
			Returns(http.StatusOK, "OK", rulev1.RuleList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/rule/{namespace}").To(apiHandler.handleGetRules).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(rulev1.RuleList{}).
			Returns(http.StatusOK, "OK", rulev1.RuleList{}))
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := rule.GetRuleList(kubeedgeClient, namespace)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := rule.GetRule(kubeedgeClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.Rule)
	err = request.ReadEntity(data)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := rule.CreateRule(kubeedgeClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rulev1.Rule)
	err = request.ReadEntity(data)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := rule.UpdateRule(kubeedgeClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteRule(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = rule.DeleteRule(kubeedgeClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
