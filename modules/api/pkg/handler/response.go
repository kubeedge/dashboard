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

// ListResponse is the unified list response DTO.
type ListResponse[T any] struct {
	Items    []T    `json:"items"`
	Total    int    `json:"total"`
	Page     int    `json:"page"`
	PageSize int    `json:"pageSize"`
	HasNext  bool   `json:"hasNext"`
	Sort     string `json:"sort,omitempty"`
	Order    string `json:"order,omitempty"`
}

func NewListResponse[T any](items []T, total, page, pageSize int, sort, order string) ListResponse[T] {
	hasNext := false
	if page > 0 && pageSize > 0 && total > page*pageSize {
		hasNext = true
	}
	return ListResponse[T]{
		Items:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
		HasNext:  hasNext,
		Sort:     sort,
		Order:    order,
	}
}
