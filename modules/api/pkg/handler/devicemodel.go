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
	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"

	"github.com/kubeedge/dashboard/api/pkg/resource/devicemodel"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addDeviceModelRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/devicemodel").To(apiHandler.handleGetDeviceModels).
			Writes(devicev1beta1.DeviceModelList{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceModelList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/devicemodel/{namespace}").To(apiHandler.handleGetDeviceModels).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device model")).
			Writes(devicev1beta1.DeviceModelList{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceModelList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/devicemodel/{namespace}/{name}").To(apiHandler.handleGetDeviceModel).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device model")).
			Param(apiV1Ws.PathParameter("name", "Name of the device model")).
			Writes(devicev1beta1.DeviceModel{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceModel{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/devicemodel/{namespace}").To(apiHandler.handleCreateDeviceModel).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device model")).
			Reads(devicev1beta1.DeviceModel{}).
			Writes(devicev1beta1.DeviceModel{}).
			Returns(http.StatusCreated, "Created", devicev1beta1.DeviceModel{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/devicemodel/{namespace}").To(apiHandler.handleUpdateDeviceModel).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device model")).
			Reads(devicev1beta1.DeviceModel{}).
			Writes(devicev1beta1.DeviceModel{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceModel{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/devicemodel/{namespace}/{name}").To(apiHandler.handleDeleteDeviceModel).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device model")).
			Param(apiV1Ws.PathParameter("name", "Name of the device model")).
			Writes(devicev1beta1.DeviceModel{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetDeviceModels(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := devicemodel.GetDeviceModelList(kubeedgeClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetDeviceModel(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := devicemodel.GetDeviceModel(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateDeviceModel(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	deviceModel := &devicev1beta1.DeviceModel{}
	err = request.ReadEntity(deviceModel)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := devicemodel.CreateDeviceModel(kubeedgeClient, namespace, deviceModel)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateDeviceModel(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	deviceModel := &devicev1beta1.DeviceModel{}
	err = request.ReadEntity(deviceModel)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	result, err := devicemodel.UpdateDeviceModel(kubeedgeClient, namespace, deviceModel)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteDeviceModel(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = devicemodel.DeleteDeviceModel(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	response.WriteHeader(http.StatusNoContent)
}
