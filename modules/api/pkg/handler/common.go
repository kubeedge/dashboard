/*
Copyright 2025 The KubeEdge Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	"k8s.io/apimachinery/pkg/version"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addCommonRoutes(apiV1Ws *restful.WebService) *APIHandler {
    apiV1Ws.Route(
        apiV1Ws.GET("/version").To(apiHandler.getVersion).
            Writes(version.Info{}).
            Returns(http.StatusOK, "OK", version.Info{}))

    apiV1Ws.Route(
        apiV1Ws.GET("/healthz").To(apiHandler.getHealth).
            Writes(common.HealthStatus{}).
            Returns(http.StatusOK, "OK", common.HealthStatus{}))

    return apiHandler
}

func (apiHandler *APIHandler) getVersion(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	versionInfo, err := common.GetVersion(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

    response.WriteEntity(versionInfo)
}

func (apiHandler *APIHandler) getHealth(request *restful.Request, response *restful.Response) {
    k8sClient, err := apiHandler.getK8sClient(request, response)
    if err != nil {
        return
    }

    status, err := common.GetHealth(k8sClient)
    if err != nil {
        errors.HandleInternalError(response, err)
        return
    }

    response.WriteEntity(status)
}
