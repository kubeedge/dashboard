package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/secret"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
	corev1 "k8s.io/api/core/v1"
)

func (apiHandler *APIHandler) addSecretRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/secret").To(apiHandler.handleGetSecrets).
			Writes(corev1.SecretList{}).
			Returns(http.StatusOK, "OK", corev1.SecretList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/secret/{namespace}").To(apiHandler.handleGetSecrets).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(corev1.SecretList{}).
			Returns(http.StatusOK, "OK", corev1.SecretList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/secret/{namespace}/{name}").To(apiHandler.handleGetSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the secret")).
			Writes(corev1.Secret{}).
			Returns(http.StatusOK, "OK", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/secret/{namespace}").To(apiHandler.handleCreateSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Secret{}).
			Writes(corev1.Secret{}).
			Returns(http.StatusCreated, "Created", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/secret/{namespace}").To(apiHandler.handleUpdateSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(corev1.Secret{}).
			Writes(corev1.Secret{}).
			Returns(http.StatusOK, "OK", corev1.Secret{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/secret/{namespace}/{name}").To(apiHandler.handleDeleteSecret).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the secret")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetSecrets(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := secret.GetSecretList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := secret.GetSecret(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	data := new(corev1.Secret)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := secret.CreateSecret(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	data := new(corev1.Secret)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := secret.UpdateSecret(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteSecret(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = secret.DeleteSecret(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
