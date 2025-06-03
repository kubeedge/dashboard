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
	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"

	"github.com/kubeedge/dashboard/api/pkg/resource/nodegroup"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addNodeGroupRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/nodegroup").To(apiHandler.handleGetNodeGroups).
			Writes(appsv1alpha1.NodeGroupList{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.NodeGroupList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/nodegroup/{name}").To(apiHandler.handleGetNodeGroup).
			Param(apiV1Ws.PathParameter("name", "Name of the node group")).
			Writes(appsv1alpha1.NodeGroup{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.NodeGroup{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/nodegroup").To(apiHandler.handleCreateNodeGroup).
			Reads(appsv1alpha1.NodeGroup{}).
			Writes(appsv1alpha1.NodeGroup{}).
			Returns(http.StatusCreated, "Created", appsv1alpha1.NodeGroup{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/nodegroup").To(apiHandler.handleUpdateNodeGroup).
			Reads(appsv1alpha1.NodeGroup{}).
			Writes(appsv1alpha1.NodeGroup{}).
			Returns(http.StatusOK, "OK", appsv1alpha1.NodeGroup{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/nodegroup/{name}").To(apiHandler.handleDeleteNodeGroup).
			Param(apiV1Ws.PathParameter("name", "Name of the node group")).
			Writes(appsv1alpha1.NodeGroup{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetNodeGroups(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := nodegroup.GetNodeGroupList(kubeedgeClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetNodeGroup(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	result, err := nodegroup.GetNodeGroup(kubeedgeClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateNodeGroup(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	data := new(appsv1alpha1.NodeGroup)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := nodegroup.CreateNodeGroup(kubeedgeClient, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateNodeGroup(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	data := new(appsv1alpha1.NodeGroup)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := nodegroup.UpdateNodeGroup(kubeedgeClient, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteNodeGroup(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	name := request.PathParameter("name")
	err = nodegroup.DeleteNodeGroup(kubeedgeClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
