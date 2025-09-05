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

package common

import (
	"sort"
	"strings"
)

// FilterClause mirrors handler.FilterClause but avoids import cycle.
type FilterClause struct {
	Field string
	Value string
	Mode  string // exact|prefix|suffix|contains
}

// FieldGetter returns a string field to enable filtering.
type FieldGetter[T any] func(item T, field string) (string, bool)

// Comparator compares two items: negative if a<b, positive if a>b, zero if equal.
type Comparator[T any] func(a, b T) int

func FilterItems[T any](items []T, filters []FilterClause, getter FieldGetter[T]) []T {
	if len(filters) == 0 {
		return items
	}
	out := make([]T, 0, len(items))
	for _, it := range items {
		if matchesAll(it, filters, getter) {
			out = append(out, it)
		}
	}
	return out
}

func matchesAll[T any](item T, filters []FilterClause, getter FieldGetter[T]) bool {
	for _, f := range filters {
		val, ok := getter(item, f.Field)
		if !ok {
			return false
		}
		if !matchValue(val, f) {
			return false
		}
	}
	return true
}

func matchValue(val string, f FilterClause) bool {
	switch f.Mode {
	case "contains":
		return strings.Contains(strings.ToLower(val), strings.ToLower(f.Value))
	case "prefix":
		return strings.HasPrefix(strings.ToLower(val), strings.ToLower(f.Value))
	case "suffix":
		return strings.HasSuffix(strings.ToLower(val), strings.ToLower(f.Value))
	default:
		return val == f.Value
	}
}

func SortItems[T any](items []T, sortField, order string, comparators map[string]Comparator[T]) {
	if sortField == "" || len(items) < 2 {
		return
	}
	cmp, ok := comparators[sortField]
	if !ok {
		return
	}
	sort.SliceStable(items, func(i, j int) bool {
		r := cmp(items[i], items[j])
		if order == "asc" {
			return r < 0
		}
		return r > 0
	})
}

func Paginate[T any](items []T, page, pageSize int) ([]T, int, bool) {
	total := len(items)
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 1
	}
	start := (page - 1) * pageSize
	if start >= total {
		return []T{}, total, false
	}
	end := start + pageSize
	if end > total {
		end = total
	}
	return items[start:end], total, end < total
}

func Project[T any, R any](items []T, projector func(T) R) []R {
	out := make([]R, 0, len(items))
	for _, it := range items {
		out = append(out, projector(it))
	}
	return out
}
