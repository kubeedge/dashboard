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

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
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

// toCommonFilterClauses converts handler.FilterClause to common.FilterClause to avoid import cycles.
func toCommonFilterClauses(in []FilterClause) []listutil.FilterClause {
	if len(in) == 0 {
		return nil
	}
	out := make([]listutil.FilterClause, 0, len(in))
	for _, f := range in {
		out = append(out, listutil.FilterClause{Field: f.Field, Value: f.Value, Mode: f.Mode})
	}
	return out
}
