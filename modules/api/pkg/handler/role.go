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
	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/role"
	"github.com/kubeedge/dashboard/errors"
)

// --- Route helper 定义 ---
// RouteOpt 是对 RouteBuilder 的配置函数（类似 functional options）
type RouteOpt func(rb *restful.RouteBuilder)

// 常用选项：Param / Reads / Writes / Returns / Doc
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

// addRoute 根据 method 动态创建 RouteBuilder 并应用所有 RouteOpt，最后调用 ws.Route(...)
func addRoute(ws *restful.WebService, method string, path string, handler restful.RouteFunction, opts ...RouteOpt) {
	var rb *restful.RouteBuilder
	switch method {
	case http.MethodGet:
		rb = ws.GET(path).To(handler)
	case http.MethodPost:
		rb = ws.POST(path).To(handler)
	case http.MethodPut:
		rb = ws.PUT(path).To(handler)
	case http.MethodDelete:
		rb = ws.DELETE(path).To(handler)
	default:
		// 保守回退为 GET（或者根据需要 panic/返回 error）
		rb = ws.GET(path).To(handler)
	}

	for _, o := range opts {
		o(rb)
	}
	ws.Route(rb)
}

// --- 使用 helper 的路由注册 ---
// 将原来的 addRoleRoutes 用下面实现替换
func (apiHandler *APIHandler) addRoleRoutes(apiV1Ws *restful.WebService) *APIHandler {
	// 复用的 path 参数（避免多次创建同样的 Parameter）
	nsParam := apiV1Ws.PathParameter("namespace", "Name of the namespace")
	nameParam := apiV1Ws.PathParameter("name", "Name of the role")

	// GET /role -> 列表（跨 namespace）
	addRoute(apiV1Ws, http.MethodGet, "/role", apiHandler.handleGetRoles,
		WithWrites(rbacv1.RoleList{}),
		WithReturns(http.StatusOK, "OK", rbacv1.RoleList{}),
		WithDoc("Get all roles"))

	// GET /role/{namespace} -> 某 namespace 下的角色列表
	addRoute(apiV1Ws, http.MethodGet, "/role/{namespace}", apiHandler.handleGetRoles,
		WithParam(nsParam),
		WithWrites(rbacv1.RoleList{}),
		WithReturns(http.StatusOK, "OK", rbacv1.RoleList{}),
		WithDoc("Get roles in a namespace"))

	// GET /role/{namespace}/{name} -> 单个角色
	addRoute(apiV1Ws, http.MethodGet, "/role/{namespace}/{name}", apiHandler.handleGetRole,
		WithParam(nsParam),
		WithParam(nameParam),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusOK, "OK", rbacv1.Role{}),
		WithDoc("Get a role by name"))

	// POST /role/{namespace} -> 创建
	addRoute(apiV1Ws, http.MethodPost, "/role/{namespace}", apiHandler.handleCreateRole,
		WithParam(nsParam),
		WithReads(rbacv1.Role{}),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusCreated, "Created", rbacv1.Role{}),
		WithDoc("Create a role in a namespace"))

	// PUT /role/{namespace} -> 更新（保留原路径行为）
	addRoute(apiV1Ws, http.MethodPut, "/role/{namespace}", apiHandler.handleUpdateRole,
		WithParam(nsParam),
		WithReads(rbacv1.Role{}),
		WithWrites(rbacv1.Role{}),
		WithReturns(http.StatusOK, "OK", rbacv1.Role{}),
		WithDoc("Update a role in a namespace"))

	// DELETE /role/{namespace}/{name} -> 删除
	addRoute(apiV1Ws, http.MethodDelete, "/role/{namespace}/{name}", apiHandler.handleDeleteRole,
		WithParam(nsParam),
		WithParam(nameParam),
		WithReturns(http.StatusNoContent, "No Content", nil),
		WithDoc("Delete a role"))

	return apiHandler
}

func (apiHandler *APIHandler) handleGetRoles(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	result, err := role.GetRoleList(k8sClient, namespace)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleGetRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	result, err := role.GetRole(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleCreateRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.Role)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := role.CreateRole(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusCreated, result)
}

func (apiHandler *APIHandler) handleUpdateRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	data := new(rbacv1.Role)
	if err := request.ReadEntity(data); err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	result, err := role.UpdateRole(k8sClient, namespace, data)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeaderAndEntity(http.StatusOK, result)
}

func (apiHandler *APIHandler) handleDeleteRole(request *restful.Request, response *restful.Response) {
	k8sClient, err := apiHandler.getK8sClient(request, response)
	if err != nil {
		return
	}

	namespace := request.PathParameter("namespace")
	name := request.PathParameter("name")
	err = role.DeleteRole(k8sClient, namespace, name)
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}
	response.WriteHeader(http.StatusNoContent)
}
