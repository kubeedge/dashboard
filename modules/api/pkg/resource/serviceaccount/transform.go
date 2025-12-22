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

package serviceaccount

import (
	"fmt"
	"strings"
	"time"

	corev1 "k8s.io/api/core/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// ServiceAccountListItem represents a simplified ServiceAccount for list responses
type ServiceAccountListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Secrets           []string          `json:"secrets"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// ServiceAccountToListItem converts a ServiceAccount to ServiceAccountListItem
func ServiceAccountToListItem(sa corev1.ServiceAccount) ServiceAccountListItem {
	age := time.Since(sa.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()

	return ServiceAccountListItem{
		Name:      sa.ObjectMeta.Name,
		Namespace: sa.ObjectMeta.Namespace,
		Secrets: func() []string {
			secrets := make([]string, len(sa.Secrets))
			for i, secret := range sa.Secrets {
				secrets[i] = secret.Name
			}
			return secrets
		}(),
		Age:               age,
		CreationTimestamp: sa.ObjectMeta.CreationTimestamp.Time,
		Labels:            sa.ObjectMeta.Labels,
	}
}

// ServiceAccountFieldGetter returns field values for filtering
func ServiceAccountFieldGetter(sa corev1.ServiceAccount, field string) (string, bool) {
	switch field {
	case "name":
		return sa.ObjectMeta.Name, true
	case "namespace":
		return sa.ObjectMeta.Namespace, true
	case "secrets":
		return fmt.Sprintf("%d", len(sa.Secrets)), true
	case "creationTimestamp":
		return sa.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// ServiceAccountComparators returns comparison functions for sorting
func ServiceAccountComparators() map[string]common.Comparator[corev1.ServiceAccount] {
	return map[string]common.Comparator[corev1.ServiceAccount]{
		"name": func(a, b corev1.ServiceAccount) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b corev1.ServiceAccount) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"secrets": func(a, b corev1.ServiceAccount) int {
			return len(a.Secrets) - len(b.Secrets)
		},
		"creationTimestamp": func(a, b corev1.ServiceAccount) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"secrets":           {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":      {},
	"namespace": {},
	"secrets":   {},
}
