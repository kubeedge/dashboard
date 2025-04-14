package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/crd"
	"github.com/kubeedge/dashboard/client"
	apiextensionsv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
)

func (apiHandler *APIHandler) addCRDRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/crd").To(apiHandler.getCRDs).
			Writes(apiextensionsv1.CustomResourceDefinitionList{}).
			Returns(http.StatusOK, "OK", apiextensionsv1.CustomResourceDefinitionList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/crd/{name}").To(apiHandler.getCRD).
			Param(apiV1Ws.PathParameter("name", "Name of the CRD")).
			Writes(apiextensionsv1.CustomResourceDefinition{}).
			Returns(http.StatusOK, "OK", apiextensionsv1.CustomResourceDefinition{}))

	return apiHandler
}

func (apiHandler *APIHandler) getCRDs(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.APIExtensionClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	result, err := crd.GetCRDList(k8sClient)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteEntity(result)
}

func (apiHandler *APIHandler) getCRD(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.APIExtensionClient(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	name := request.PathParameter("name")
	result, err := crd.GetCRD(k8sClient, name)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}
	response.WriteEntity(result)
}
