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

package clusterrolebinding

import (
	"strings"
	"time"

	rbacv1 "k8s.io/api/rbac/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// ClusterRoleBindingListItem represents a simplified ClusterRoleBinding for list responses
type ClusterRoleBindingListItem struct {
	Name              string            `json:"name"`
	Role              string            `json:"role"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// ClusterRoleBindingToListItem converts a ClusterRoleBinding to ClusterRoleBindingListItem
func ClusterRoleBindingToListItem(crb rbacv1.ClusterRoleBinding) ClusterRoleBindingListItem {
	age := time.Since(crb.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()
	
	return ClusterRoleBindingListItem{
		Name:              crb.ObjectMeta.Name,
		Role:              crb.RoleRef.Name,
		Age:               age,
		CreationTimestamp: crb.ObjectMeta.CreationTimestamp.Time,
		Labels:            crb.ObjectMeta.Labels,
	}
}

// ClusterRoleBindingFieldGetter returns field values for filtering
func ClusterRoleBindingFieldGetter(crb rbacv1.ClusterRoleBinding, field string) (string, bool) {
	switch field {
	case "name":
		return crb.ObjectMeta.Name, true
	case "role":
		return crb.RoleRef.Name, true
	case "creationTimestamp":
		return crb.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// ClusterRoleBindingComparators returns comparison functions for sorting
func ClusterRoleBindingComparators() map[string]common.Comparator[rbacv1.ClusterRoleBinding] {
	return map[string]common.Comparator[rbacv1.ClusterRoleBinding]{
		"name": func(a, b rbacv1.ClusterRoleBinding) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"role": func(a, b rbacv1.ClusterRoleBinding) int {
			return strings.Compare(a.RoleRef.Name, b.RoleRef.Name)
		},
		"creationTimestamp": func(a, b rbacv1.ClusterRoleBinding) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"role":              {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name": {},
	"role": {},
}
