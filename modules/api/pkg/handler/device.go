package handler

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"
	"github.com/kubeedge/dashboard/api/pkg/resource/device"
	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addDeviceRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/device").To(apiHandler.handleGetDevices).
			Writes(devicev1beta1.DeviceList{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceList{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/device/{namespace}").To(apiHandler.handleGetDevices).
			Param(apiV1Ws.PathParameter("namespace", "Namespace of the device")).
			Writes(devicev1beta1.DeviceList{}).
			Returns(http.StatusOK, "OK", devicev1beta1.DeviceList{}))
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := device.GetDeviceList(kubeedgeClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteEntity(result)
}

func (apiHandler *APIHandler) handleGetDevice(request *restful.Request, response *restful.Response) {
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
	kubeedgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
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
