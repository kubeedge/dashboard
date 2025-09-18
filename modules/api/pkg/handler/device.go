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

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/device"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addDeviceRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/device").To(apiHandler.handleGetDevices).
			Writes(ListResponse[device.DeviceListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[device.DeviceListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/device/{namespace}").To(apiHandler.handleGetDevices).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Writes(ListResponse[device.DeviceListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[device.DeviceListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/device/{namespace}/{name}").To(apiHandler.handleGetDevice).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Param(apiV1Ws.PathParameter("name", "Name of the device")).
			Writes(devicev1beta1.Device{}).
			Returns(http.StatusOK, "OK", devicev1beta1.Device{}))
	apiV1Ws.Route(
		apiV1Ws.POST("/device/{namespace}").To(apiHandler.handleCreateDevice).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Reads(devicev1beta1.Device{}).
			Writes(devicev1beta1.Device{}).
			Returns(http.StatusCreated, "Created", devicev1beta1.Device{}))
	apiV1Ws.Route(
		apiV1Ws.PUT("/device/{namespace}").To(apiHandler.handleUpdateDevice).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Reads(devicev1beta1.Device{}).
			Writes(devicev1beta1.Device{}).
			Returns(http.StatusOK, "OK", devicev1beta1.Device{}))
	apiV1Ws.Route(
		apiV1Ws.DELETE("/device/{namespace}/{name}").To(apiHandler.handleDeleteDevice).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Param(apiV1Ws.PathParameter("name", "Name of the device")).
			Writes(devicev1beta1.Device{}).
			Returns(http.StatusNoContent, "No Content", nil))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetDevices(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: device.SortableFields, FilterableFields: device.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")

	rawList, err := device.GetDeviceList(kubeedgeClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	items := rawList.Items

	items = common.FilterItems(items, toCommonFilterClauses(query.Filters), device.DeviceFieldGetter)
	common.SortItems(items, query.Sort, query.Order, device.DeviceComparators())
	pageItems, total, _ := common.Paginate(items, query.Page, query.PageSize)
	view := common.Project(pageItems, device.DeviceToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) handleGetDevice(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := device.GetDevice(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleCreateDevice(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(devicev1beta1.Device)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := device.CreateDevice(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleUpdateDevice(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(devicev1beta1.Device)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := device.UpdateDevice(kubeedgeClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleDeleteDevice(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := apiHandler.getKubeEdgeClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = device.DeleteDevice(kubeedgeClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
