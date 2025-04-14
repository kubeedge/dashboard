package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/node"
	"github.com/kubeedge/dashboard/client"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addNodeRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/node").To(apiHandler.handleGetNamespaces).
			Writes(corev1.NamespaceList{}).
			Returns(http.StatusOK, "OK", corev1.NamespaceList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/node/{name}").To(apiHandler.handleGetNode).
			Param(apiV1Ws.PathParameter("name", "Name of the node")).
			Writes(corev1.Node{}).
			Returns(http.StatusOK, "OK", corev1.Node{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/node").To(apiHandler.handleUpdateNode).
			Reads(corev1.Node{}).
			Writes(corev1.Node{}).
			Returns(http.StatusOK, "OK", corev1.Node{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/node/{name}").To(apiHandler.handleDeleteNode).
			Param(apiV1Ws.PathParameter("name", "Name of the node")).
			Writes(corev1.Node{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetNodes(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	result, err := node.GetNodeList(k8sClient)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	name := request.PathParameter("name")
	result, err := node.GetNode(k8sClient, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleUpdateNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	data := new(corev1.Node)
	if err := request.ReadEntity(data); err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := node.UpdateNode(k8sClient, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	name := request.PathParameter("name")
	err = node.DeleteNode(k8sClient, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
