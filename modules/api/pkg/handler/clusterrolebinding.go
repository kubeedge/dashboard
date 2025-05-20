package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/clusterrolebinding"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
	rbacv1 "k8s.io/api/rbac/v1"
)

func (apiHandler *APIHandler) addClusterRoleBindingRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrolebinding").To(apiHandler.handleGetClusterRoleBindings).
			Writes(rbacv1.ClusterRoleBindingList{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBindingList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/clusterrolebinding/{name}").To(apiHandler.handleGetClusterRoleBinding).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRoleBinding")).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/clusterrolebinding").To(apiHandler.handleCreateClusterRoleBinding).
			Reads(rbacv1.ClusterRoleBinding{}).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/clusterrolebinding").To(apiHandler.handleUpdateClusterRoleBinding).
			Reads(rbacv1.ClusterRoleBinding{}).
			Writes(rbacv1.ClusterRoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.ClusterRoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/clusterrolebinding/{name}").To(apiHandler.handleDeleteClusterRoleBinding).
			Param(apiV1Ws.PathParameter("name", "Name of the ClusterRoleBinding")).
			Returns(http.StatusNoContent, "OK", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetClusterRoleBindings(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.GetClusterRoleBindingList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	result, err := clusterrolebinding.GetClusterRoleBinding(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	clusterRoleBinding := new(rbacv1.ClusterRoleBinding)
	err = request.ReadEntity(&clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.CreateClusterRoleBinding(k8sClient, clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	clusterRoleBinding := new(rbacv1.ClusterRoleBinding)
	err = request.ReadEntity(&clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := clusterrolebinding.UpdateClusterRoleBinding(k8sClient, clusterRoleBinding)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteClusterRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	err = clusterrolebinding.DeleteClusterRoleBinding(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
