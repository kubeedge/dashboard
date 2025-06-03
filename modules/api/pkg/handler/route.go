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
)

type APIHandler struct {
}

func CreateHTTPAPIHandler() (*restful.Container, error) {
	apiHandler := APIHandler{}

	wsContainer := restful.NewContainer()
	wsContainer.EnableContentEncoding(true)

	apiV1Ws := new(restful.WebService)

	apiV1Ws.Path("/api/v1").Produces(restful.MIME_JSON).Consumes(restful.MIME_JSON)

	apiHandler.
		addClusterRoleRoutes(apiV1Ws).
		addClusterRoleBindingRoutes(apiV1Ws).
		addConfigMapRoutes(apiV1Ws).
		addCRDRoutes(apiV1Ws).
		addDeploymentRoutes(apiV1Ws).
		addDeviceRoutes(apiV1Ws).
		addDeviceModelRoutes(apiV1Ws).
		addEdgeApplicationRoutes(apiV1Ws).
		addNamespaceRoutes(apiV1Ws).
		addNodeRoutes(apiV1Ws).
		addNodeGroupRoutes(apiV1Ws).
		addPodRoutes(apiV1Ws).
		addRoleRoutes(apiV1Ws).
		addRoleBindingRoutes(apiV1Ws).
		addRuleRoutes(apiV1Ws).
		addRuleEndpointRoutes(apiV1Ws).
		addSecretRoutes(apiV1Ws).
		addServiceRoutes(apiV1Ws).
		addServiceAccountRoutes(apiV1Ws).
		addCommonRoutes(apiV1Ws)

	wsContainer.Add(apiV1Ws)

	return wsContainer, nil
}

func CreateKeinkAPIHandler() (*restful.Container, error) {
	apiHandler := APIHandler{}

	wsContainer := restful.NewContainer()

	keinkWs := new(restful.WebService)

	keinkWs.Route(
		keinkWs.GET("/keink/run").
			To(apiHandler.runKubeEdgeByKeink).Produces("text/event-stream"))
	keinkWs.Route(
		keinkWs.GET("/keink/check").
			To(apiHandler.checkIsAbleToRunKeink).Produces(restful.MIME_JSON).Returns(200, "OK", nil))

	wsContainer.Add(keinkWs)

	return wsContainer, nil
}
