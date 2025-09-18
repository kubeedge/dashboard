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

package rolebinding

import (
	"strings"
	"time"

	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// RoleBindingListItem represents a simplified RoleBinding for list responses
type RoleBindingListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Role              string            `json:"role"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// RoleBindingToListItem converts a RoleBinding to RoleBindingListItem
func RoleBindingToListItem(rb rbacv1.RoleBinding) RoleBindingListItem {
	age := time.Since(rb.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()
	
	return RoleBindingListItem{
		Name:              rb.ObjectMeta.Name,
		Namespace:         rb.ObjectMeta.Namespace,
		Role:              rb.RoleRef.Name,
		Age:               age,
		CreationTimestamp: rb.ObjectMeta.CreationTimestamp.Time,
		Labels:            rb.ObjectMeta.Labels,
	}
}

// RoleBindingFieldGetter returns field values for filtering
func RoleBindingFieldGetter(rb rbacv1.RoleBinding, field string) (string, bool) {
	switch field {
	case "name":
		return rb.ObjectMeta.Name, true
	case "namespace":
		return rb.ObjectMeta.Namespace, true
	case "role":
		return rb.RoleRef.Name, true
	case "creationTimestamp":
		return rb.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// RoleBindingComparators returns comparison functions for sorting
func RoleBindingComparators() map[string]common.Comparator[rbacv1.RoleBinding] {
	return map[string]common.Comparator[rbacv1.RoleBinding]{
		"name": func(a, b rbacv1.RoleBinding) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b rbacv1.RoleBinding) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"role": func(a, b rbacv1.RoleBinding) int {
			return strings.Compare(a.RoleRef.Name, b.RoleRef.Name)
		},
		"creationTimestamp": func(a, b rbacv1.RoleBinding) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"role":              {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":      {},
	"namespace": {},
	"role":      {},
}
