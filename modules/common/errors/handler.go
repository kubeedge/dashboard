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

package errors

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

// NewBadRequest creates a BadRequest error with message
func NewBadRequest(message string) error {
	return k8serrors.NewBadRequest(message)
}

func HandleError(err error) (int, error) {
	if k8serrors.IsBadRequest(err) {
		return http.StatusBadRequest, k8serrors.NewBadRequest(err.Error())
	}
	if k8serrors.IsUnauthorized(err) {
		return http.StatusUnauthorized, k8serrors.NewUnauthorized("Unauthorized")
	}

	if k8serrors.IsForbidden(err) {
		return http.StatusForbidden, k8serrors.NewForbidden(schema.GroupResource{}, "Forbidden", err)
	}

	return http.StatusInternalServerError, err
}

func HandleInternalError(response *restful.Response, err error) {
	code, err := HandleError(err)

	response.AddHeader("Content-Type", "plain/text")
	_ = response.WriteError(code, err)
}
