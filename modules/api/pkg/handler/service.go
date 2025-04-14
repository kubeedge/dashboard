package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/service"
	"github.com/kubeedge/dashboard/client"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addServiceRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/service").To(apiHandler.getServiceList).
			Writes(corev1.ServiceList{}).
			Returns(http.StatusOK, "OK", corev1.ServiceList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/service/{namespace}").To(apiHandler.getServiceList).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(corev1.ServiceList{}).
			Returns(http.StatusOK, "OK", corev1.ServiceList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/service/{namespace}/{name}").To(apiHandler.getService).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the service")).
			Writes(corev1.Service{}).
			Returns(http.StatusOK, "OK", corev1.Service{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/service/{namespace}").To(apiHandler.createService).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Service{}).
			Writes(corev1.Service{}).
			Returns(http.StatusCreated, "Created", corev1.Service{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/service/{namespace}").To(apiHandler.updateService).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Service{}).
			Writes(corev1.Service{}).
			Returns(http.StatusOK, "OK", corev1.Service{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/service/{namespace}/{name}").To(apiHandler.deleteService).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the service")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) getServiceList(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := service.GetServiceList(k8sClient, namespace)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) getService(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := service.GetService(k8sClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) createService(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.Service)
	err = request.ReadEntity(data)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := service.CreateService(k8sClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) updateService(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.Service)
	err = request.ReadEntity(data)
	if err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := service.UpdateService(k8sClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) deleteService(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = service.DeleteService(k8sClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
