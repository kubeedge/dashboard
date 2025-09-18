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

package role

import (
	"strings"
	"time"

	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// RoleListItem represents a simplified Role for list responses
type RoleListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// RoleToListItem converts a Role to RoleListItem
func RoleToListItem(r rbacv1.Role) RoleListItem {
	age := time.Since(r.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()
	
	return RoleListItem{
		Name:              r.ObjectMeta.Name,
		Namespace:         r.ObjectMeta.Namespace,
		Age:               age,
		CreationTimestamp: r.ObjectMeta.CreationTimestamp.Time,
		Labels:            r.ObjectMeta.Labels,
	}
}

// RoleFieldGetter returns field values for filtering
func RoleFieldGetter(r rbacv1.Role, field string) (string, bool) {
	switch field {
	case "name":
		return r.ObjectMeta.Name, true
	case "namespace":
		return r.ObjectMeta.Namespace, true
	case "creationTimestamp":
		return r.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// RoleComparators returns comparison functions for sorting
func RoleComparators() map[string]common.Comparator[rbacv1.Role] {
	return map[string]common.Comparator[rbacv1.Role]{
		"name": func(a, b rbacv1.Role) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b rbacv1.Role) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"creationTimestamp": func(a, b rbacv1.Role) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":      {},
	"namespace": {},
}
