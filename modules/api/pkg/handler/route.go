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
