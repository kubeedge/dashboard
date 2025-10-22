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
	"github.com/emicklei/go-restful/v3"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	apiextensionsclientset "k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"
	k8sClient "k8s.io/client-go/kubernetes"

	"github.com/kubeedge/dashboard/client"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) getK8sClient(
	request *restful.Request,
	response *restful.Response,
) (k8sClient.Interface, error) {
	k8sClient, err := client.Client(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return nil, err
	}

	return k8sClient, nil
}

func (apiHandler *APIHandler) getAPIExtensionClient(
	request *restful.Request,
	response *restful.Response,
) (apiextensionsclientset.Interface, error) {
	apiExtClient, err := client.APIExtensionClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return nil, err
	}

	return apiExtClient, nil
}

func (apiHandler *APIHandler) getKubeEdgeClient(
	request *restful.Request,
	response *restful.Response,
) (kubeedgeClient.Interface, error) {
	kubeEdgeClient, err := client.KubeEdgeClient(request.Request)
	if err != nil {
		errors.HandleInternalError(response, err)
		return nil, err
	}

	return kubeEdgeClient, nil
}

// RouteOpt is a configuration function for RouteBuilder (similar to functional options).
type RouteOpt func(rb *restful.RouteBuilder)

// Common options: Param / Reads / Writes / Returns / Doc.
func WithParam(p *restful.Parameter) RouteOpt {
	return func(rb *restful.RouteBuilder) {
		rb.Param(p)
	}
}

func WithReads(obj interface{}) RouteOpt {
	return func(rb *restful.RouteBuilder) {
		rb.Reads(obj)
	}
}

func WithWrites(obj interface{}) RouteOpt {
	return func(rb *restful.RouteBuilder) {
		rb.Writes(obj)
	}
}

func WithReturns(code int, desc string, obj interface{}) RouteOpt {
	return func(rb *restful.RouteBuilder) {
		rb.Returns(code, desc, obj)
	}
}

func WithDoc(doc string) RouteOpt {
	return func(rb *restful.RouteBuilder) {
		rb.Doc(doc)
	}
}

// AddRoute creates a RouteBuilder based on HTTP method, applies all RouteOpt,
// and registers it to the WebService.
func AddRoute(ws *restful.WebService, method string, path string, handler restful.RouteFunction, opts ...RouteOpt) {
	rb := ws.Method(method).Path(path).To(handler)

	for _, o := range opts {
		o(rb)
	}
	ws.Route(rb)
}
