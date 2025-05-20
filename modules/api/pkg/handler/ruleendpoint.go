package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	rulev1 "github.com/kubeedge/api/apis/rules/v1"
	"github.com/kubeedge/dashboard/api/pkg/resource/ruleendpoint"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addRuleEndpointRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/ruleendpoint").To(apiHandler.handleGetRuleEndpoints).
			Writes(rulev1.RuleEndpointList{}).
			Returns(http.StatusOK, "OK", rulev1.RuleEndpointList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/ruleendpoint/{namespace}").To(apiHandler.handleGetRuleEndpoints).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(rulev1.RuleEndpointList{}).
			Returns(http.StatusOK, "OK", rulev1.RuleEndpointList{}))
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := ruleendpoint.GetRuleEndpointList(kubeedgeClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetRuleEndpoint(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = ruleendpoint.DeleteRuleEndpoint(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
