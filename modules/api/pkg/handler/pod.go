package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/pod"
	"github.com/kubeedge/dashboard/client"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addPodRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/pod").To(apiHandler.handleGetPods).
			Writes(corev1.PodList{}).
			Returns(http.StatusOK, "OK", corev1.PodList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/pod/{namespace}").To(apiHandler.handleGetPods).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the Pod")).
			Writes(corev1.PodList{}).
			Returns(http.StatusOK, "OK", corev1.PodList{}))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetPods(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := pod.GetPodList(k8sClient, namespace)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}
