package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
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
		errors.HandleInternalError(response, err)
		return
	}

	versionInfo, err := common.GetVersion(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(versionInfo)
}
