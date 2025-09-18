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
	apiextensionsv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
	"github.com/kubeedge/dashboard/api/pkg/resource/crd"
	"github.com/kubeedge/dashboard/errors"
)

func (apiHandler *APIHandler) addCRDRoutes(apiV1Ws *restful.WebService) *APIHandler {
	apiV1Ws.Route(
		apiV1Ws.GET("/crd").To(apiHandler.getCRDs).
			Writes(ListResponse[crd.CRDListItem]{}).
			Returns(http.StatusOK, "OK", ListResponse[crd.CRDListItem]{}))
	apiV1Ws.Route(
		apiV1Ws.GET("/crd/{name}").To(apiHandler.getCRD).
			Param(apiV1Ws.PathParameter("name", "Name of the CRD")).
			Writes(apiextensionsv1.CustomResourceDefinition{}).
			Returns(http.StatusOK, "OK", apiextensionsv1.CustomResourceDefinition{}))

	return apiHandler
}

func (apiHandler *APIHandler) getCRDs(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getAPIExtensionClient(request, response)
	if err != nil {
		return
	}

	query, err := ParseListQuery(request, AllowedFields{SortableFields: crd.SortableFields, FilterableFields: crd.FilterableFields})
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	rawList, err := crd.GetCRDList(k8sClient)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	items := rawList.Items

	items = common.FilterItems(items, toCommonFilterClauses(query.Filters), crd.CRDFieldGetter)
	common.SortItems(items, query.Sort, query.Order, crd.CRDComparators())
	pageItems, total, _ := common.Paginate(items, query.Page, query.PageSize)
	view := common.Project(pageItems, crd.CRDToListItem)
	response.WriteHeaderAndEntity(http.StatusOK, NewListResponse(view, total, query.Page, query.PageSize, query.Sort, query.Order))
}

func (apiHandler *APIHandler) getCRD(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getAPIExtensionClient(request, response)
	if err != nil {
		return
	}

	name := request.PathParameter("name")
	result, err := crd.GetCRD(k8sClient, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteEntity(result)
}
