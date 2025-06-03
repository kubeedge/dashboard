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
	corev1 "k8s.io/api/core/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/pod"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addPodRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/pod").To(apiHandler.handleGetPods).
			Writes(corev1.PodList{}).
			Returns(http.StatusOK, "OK", corev1.PodList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/pod/{namespace}").To(apiHandler.handleGetPods).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the Pod")).
			Writes(corev1.PodList{}).
			Returns(http.StatusOK, "OK", corev1.PodList{}))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetPods(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := pod.GetPodList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}
