package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"
	"github.com/kubeedge/dashboard/api/pkg/resource/edgeapplication"
	"github.com/kubeedge/dashboard/client"
)

func (apiHandler *APIHandler) addEdgeApplicationRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication").To(apiHandler.handleGetEdgeApplications).
			Writes(appsv1alpha1.EdgeApplicationList{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplicationList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication/{namespace}").To(apiHandler.handleGetEdgeApplications).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Writes(appsv1alpha1.EdgeApplicationList{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplicationList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/edgeapplication/{namespace}/{name}").To(apiHandler.handleGetEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Param(apiV1Ws.PathParameter("name", "Name of the edge application")).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/edgeapplication/{namespace}").To(apiHandler.handleCreateEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Reads(appsv1alpha1.EdgeApplication{}).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusCreated, "Created", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/edgeapplication/{namespace}").To(apiHandler.handleUpdateEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Reads(appsv1alpha1.EdgeApplication{}).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.EdgeApplication{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/edgeapplication/{namespace}/{name}").To(apiHandler.handleDeleteEdgeApplication).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the edge application")).
			Param(apiV1Ws.PathParameter("name", "Name of the edge application")).
			Writes(appsv1alpha1.EdgeApplication{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetEdgeApplications(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := edgeapplication.GetEdgeApplicationList(kubeedgeClient, namespace)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := edgeapplication.GetEdgeApplication(kubeedgeClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1alpha1.EdgeApplication)
	if err := request.ReadEntity(data); err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := edgeapplication.CreateEdgeApplication(kubeedgeClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(appsv1alpha1.EdgeApplication)
	if err := request.ReadEntity(data); err != nil {
		response.WriteError(http.StatusBadRequest, err)
		return
	}

	result, err := edgeapplication.UpdateEdgeApplication(kubeedgeClient, namespace, data)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteEdgeApplication(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = edgeapplication.DeleteEdgeApplication(kubeedgeClient, namespace, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	response.WriteHeaderAndEntity(http.StatusNoContent, nil)
}
