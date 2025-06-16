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

	"github.com/kubeedge/dashboard/api/pkg/resource/node"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addNodeRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/node").To(apiHandler.handleGetNodes).
			Writes(corev1.NamespaceList{}).
			Returns(http.StatusOK, "OK", corev1.NamespaceList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/node/{name}").To(apiHandler.handleGetNode).
			Param(apiV1Ws.PathParameter("name", "Name of the node")).
			Writes(corev1.Node{}).
			Returns(http.StatusOK, "OK", corev1.Node{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/node").To(apiHandler.handleUpdateNode).
			Reads(corev1.Node{}).
			Writes(corev1.Node{}).
			Returns(http.StatusOK, "OK", corev1.Node{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/node/{name}").To(apiHandler.handleDeleteNode).
			Param(apiV1Ws.PathParameter("name", "Name of the node")).
			Writes(corev1.Node{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetNodes(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	result, err := node.GetNodeList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	name := request.PathParameter("name")
	result, err := node.GetNode(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleUpdateNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	data := new(corev1.Node)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := node.UpdateNode(k8sClient, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteNode(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	name := request.PathParameter("name")
	err = node.DeleteNode(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
