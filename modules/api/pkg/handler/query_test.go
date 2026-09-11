/*
Copyright 2026 The KubeEdge Authors.

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
	"net/url"
	"testing"

	k8serrors "k8s.io/apimachinery/pkg/api/errors"
)

func TestParseListQueryRejectsPageOverflow(t *testing.T) {
	_, err := parseListQueryFromValues(url.Values{
		"page":     {"9223372036854775807"},
		"pageSize": {"200"},
	}, AllowedFields{})
	if !k8serrors.IsBadRequest(err) {
		t.Fatalf("parseListQueryFromValues() error = %v, want BadRequest", err)
	}
}
