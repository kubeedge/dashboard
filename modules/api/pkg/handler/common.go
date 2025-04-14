package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/client"
	"k8s.io/apimachinery/pkg/version"
)

func (apiHandler *APIHandler) addCommonRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/version").To(apiHandler.getVersion).
			Writes(version.Info{}).
			Returns(http.StatusOK, "OK", version.Info{}))

	return apiHandler
}

func (apiHandler *APIHandler) getVersion(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		response.WriteError(http.StatusInternalServerError, err)
		return
	}

	versionInfo, err := common.GetVersion(k8sClient)
	if err != nil {
		response.WriteErrorString(http.StatusInternalServerError, "Failed to get Kubernetes version")
		return
	}

	response.WriteEntity(versionInfo)
}
