package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/serviceaccount"
	"github.com/kubeedge/dashboard/client"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addServiceAccountRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/serviceaccount").To(apiHandler.getServiceAccountList).
			Writes(corev1.ServiceAccountList{}).
			Returns(http.StatusOK, "OK", corev1.ServiceAccountList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/serviceaccount/{namespace}").To(apiHandler.getServiceAccountList).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(corev1.ServiceAccountList{}).
			Returns(http.StatusOK, "OK", corev1.ServiceAccountList{}))
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
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := serviceaccount.GetServiceAccountList(k8sClient, namespace)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) getServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := serviceaccount.GetServiceAccount(k8sClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) createServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.ServiceAccount)
	if err := request.ReadEntity(data); err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := serviceaccount.CreateServiceAccount(k8sClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) updateServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(corev1.ServiceAccount)
	if err := request.ReadEntity(data); err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := serviceaccount.UpdateServiceAccount(k8sClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) deleteServiceAccount(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = serviceaccount.DeleteServiceAccount(k8sClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
