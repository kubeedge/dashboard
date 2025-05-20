package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/rolebinding"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
	rbacv1 "k8s.io/api/rbac/v1"
)

func (apiHandler *APIHandler) addRoleBindingRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/rolebinding").To(apiHandler.handleGetRoleBindings).
			Writes(rbacv1.RoleBindingList{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleBindingList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/rolebinding/{namespace}").To(apiHandler.handleGetRoleBindings).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Writes(rbacv1.RoleBindingList{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleBindingList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/rolebinding/{namespace}/{name}").To(apiHandler.handleGetRoleBinding).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the role binding")).
			Writes(rbacv1.RoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/rolebinding/{namespace}").To(apiHandler.handleCreateRoleBinding).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rbacv1.RoleBinding{}).
			Writes(rbacv1.RoleBinding{}).
			Returns(http.StatusCreated, "Created", rbacv1.RoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/rolebinding/{namespace}").To(apiHandler.handleUpdateRoleBinding).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Reads(rbacv1.RoleBinding{}).
			Writes(rbacv1.RoleBinding{}).
			Returns(http.StatusOK, "OK", rbacv1.RoleBinding{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/rolebinding/{namespace}/{name}").To(apiHandler.handleDeleteRoleBinding).
			Param(apiV1Ws.PathParameter("namespace", "Name of the namespace")).
			Param(apiV1Ws.PathParameter("name", "Name of the role binding")).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRoleBindings(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := rolebinding.GetRoleBindingList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := rolebinding.GetRoleBinding(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.RoleBinding)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := rolebinding.CreateRoleBinding(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.RoleBinding)
	err = request.ReadEntity(data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := rolebinding.UpdateRoleBinding(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteRoleBinding(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = rolebinding.DeleteRoleBinding(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
