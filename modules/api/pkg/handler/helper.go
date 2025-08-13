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
	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// toCommonFilters converts handler.FilterClause to common.FilterClause to avoid import cycles.
func toCommonFilters(in []FilterClause) []listutil.FilterClause {
	if len(in) == 0 {
		return nil
	}
	out := make([]listutil.FilterClause, 0, len(in))
	for _, f := range in {
		out = append(out, listutil.FilterClause{Field: f.Field, Value: f.Value, Mode: f.Mode})
	}
	return out
}
