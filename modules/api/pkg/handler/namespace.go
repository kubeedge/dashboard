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

	"github.com/kubeedge/dashboard/api/pkg/resource/namespace"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addNamespaceRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/namespace").To(apiHandler.handleGetNamespaces).
			Writes(corev1.NamespaceList{}).
			Returns(http.StatusOK, "OK", corev1.NamespaceList{}))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetNamespaces(request *restful.Request, response *restful.Response) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := namespace.GetNamespaceList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}
