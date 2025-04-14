package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/namespace"
	"github.com/kubeedge/dashboard/client"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addNamespaceRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/namespace").To(apiHandler.handleGetNamespaces).
			Writes(corev1.NamespaceList{}).
			Returns(http.StatusOK, "OK", corev1.NamespaceList{}))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetNamespaces(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	result, err := namespace.GetNamespaceList(k8sClient)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}
