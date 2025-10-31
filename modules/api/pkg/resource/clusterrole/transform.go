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

package clusterrole

import (
	"strings"
	"time"

	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// ClusterRoleListItem represents a simplified ClusterRole for list responses
type ClusterRoleListItem struct {
	Name              string            `json:"name"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// ClusterRoleToListItem converts a ClusterRole to ClusterRoleListItem
func ClusterRoleToListItem(cr rbacv1.ClusterRole) ClusterRoleListItem {
	age := time.Since(cr.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()
	
	return ClusterRoleListItem{
		Name:              cr.ObjectMeta.Name,
		Age:               age,
		CreationTimestamp: cr.ObjectMeta.CreationTimestamp.Time,
		Labels:            cr.ObjectMeta.Labels,
	}
}

// ClusterRoleFieldGetter returns field values for filtering
func ClusterRoleFieldGetter(cr rbacv1.ClusterRole, field string) (string, bool) {
	switch field {
	case "name":
		return cr.ObjectMeta.Name, true
	case "creationTimestamp":
		return cr.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// ClusterRoleComparators returns comparison functions for sorting
func ClusterRoleComparators() map[string]common.Comparator[rbacv1.ClusterRole] {
	return map[string]common.Comparator[rbacv1.ClusterRole]{
		"name": func(a, b rbacv1.ClusterRole) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"creationTimestamp": func(a, b rbacv1.ClusterRole) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name": {},
}
