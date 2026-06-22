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
	"net/url"
	"strconv"
	"strings"

	"github.com/emicklei/go-restful/v3"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
)

// AllowedFields constrains which fields are allowed in sort/filter.
type AllowedFields struct {
	SortableFields   map[string]struct{}
	FilterableFields map[string]struct{}
}

// FilterClause expresses a single filter predicate.
type FilterClause struct {
	Field string
	Value string
	Mode  string // exact|prefix|suffix|contains
}

// ListQuery carries normalized list query params.
type ListQuery struct {
	Page     int
	PageSize int
	Sort     string
	Order    string // asc|desc or empty if Sort empty
	Filters  []FilterClause
}

const (
	defaultPage     = 1
	defaultPageSize = 20
	maxPageSize     = 200
)

// ParseListQuery parses/validates query params from request.
func ParseListQuery(req *restful.Request, allowed AllowedFields) (ListQuery, error) {
	return parseListQueryFromValues(req.Request.URL.Query(), allowed)
}

func parseListQueryFromValues(values url.Values, allowed AllowedFields) (ListQuery, error) {
	var out ListQuery

	// page
	if s := strings.TrimSpace(values.Get("page")); s != "" {
		v, err := strconv.Atoi(s)
		if err != nil || v < 1 {
			return ListQuery{}, k8serrors.NewBadRequest("invalid page: must be integer >= 1")
		}
		out.Page = v
	} else {
		out.Page = defaultPage
	}

	// pageSize
	if s := strings.TrimSpace(values.Get("pageSize")); s != "" {
		v, err := strconv.Atoi(s)
		if err != nil || v < 1 || v > maxPageSize {
			return ListQuery{}, k8serrors.NewBadRequest("invalid pageSize: must be 1..200")
		}
		out.PageSize = v
	} else {
		out.PageSize = defaultPageSize
	}

	// sort/order
	sort := strings.TrimSpace(values.Get("sort"))
	if sort != "" {
		if allowed.SortableFields != nil {
			if _, ok := allowed.SortableFields[sort]; !ok {
				return ListQuery{}, k8serrors.NewBadRequest("invalid sort field")
			}
		}
		out.Sort = sort
		ord := strings.ToLower(strings.TrimSpace(values.Get("order")))
		if ord == "" {
			ord = "desc"
		}
		if ord != "asc" && ord != "desc" {
			return ListQuery{}, k8serrors.NewBadRequest("invalid order: must be asc or desc")
		}
		out.Order = ord
	}

	// filters
	if filter := strings.TrimSpace(values.Get("filter")); filter != "" {
		parts := strings.Split(filter, ",")
		out.Filters = make([]FilterClause, 0, len(parts))
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}
			kv := strings.SplitN(p, ":", 2)
			if len(kv) != 2 || kv[0] == "" {
				return ListQuery{}, k8serrors.NewBadRequest("invalid filter syntax: expected field:value")
			}
			field := kv[0]
			if allowed.FilterableFields != nil {
				if _, ok := allowed.FilterableFields[field]; !ok {
					return ListQuery{}, k8serrors.NewBadRequest("invalid filter field")
				}
			}
			mode, val := normalizeFilterValue(kv[1])
			out.Filters = append(out.Filters, FilterClause{Field: field, Value: val, Mode: mode})
		}
	}

	return out, nil
}

func normalizeFilterValue(raw string) (string, string) {
	r := strings.TrimSpace(raw)
	if r == "" {
		return "exact", ""
	}
	if strings.HasPrefix(r, "*") && strings.HasSuffix(r, "*") && len(r) >= 2 {
		return "contains", strings.Trim(r, "*")
	}
	if strings.HasPrefix(r, "*") {
		return "suffix", strings.TrimPrefix(r, "*")
	}
	if strings.HasSuffix(r, "*") {
		return "prefix", strings.TrimSuffix(r, "*")
	}
	return "exact", r
}
