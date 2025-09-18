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

package crd

import (
	"strings"
	"time"

	apiextensionsv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// CRDListItem represents a simplified CRD for list responses
type CRDListItem struct {
	Name              string            `json:"name"`
	Group             string            `json:"group"`
	Kind              string            `json:"kind"`
	Scope             string            `json:"scope"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// CRDToListItem converts a CRD to CRDListItem
func CRDToListItem(crd apiextensionsv1.CustomResourceDefinition) CRDListItem {
	age := time.Since(crd.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()
	
	return CRDListItem{
		Name:              crd.ObjectMeta.Name,
		Group:             crd.Spec.Group,
		Kind:              crd.Spec.Names.Kind,
		Scope:             string(crd.Spec.Scope),
		Age:               age,
		CreationTimestamp: crd.ObjectMeta.CreationTimestamp.Time,
		Labels:            crd.ObjectMeta.Labels,
	}
}

// CRDFieldGetter returns field values for filtering
func CRDFieldGetter(crd apiextensionsv1.CustomResourceDefinition, field string) (string, bool) {
	switch field {
	case "name":
		return crd.ObjectMeta.Name, true
	case "group":
		return crd.Spec.Group, true
	case "kind":
		return crd.Spec.Names.Kind, true
	case "scope":
		return string(crd.Spec.Scope), true
	case "creationTimestamp":
		return crd.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// CRDComparators returns comparison functions for sorting
func CRDComparators() map[string]common.Comparator[apiextensionsv1.CustomResourceDefinition] {
	return map[string]common.Comparator[apiextensionsv1.CustomResourceDefinition]{
		"name": func(a, b apiextensionsv1.CustomResourceDefinition) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"group": func(a, b apiextensionsv1.CustomResourceDefinition) int {
			return strings.Compare(a.Spec.Group, b.Spec.Group)
		},
		"kind": func(a, b apiextensionsv1.CustomResourceDefinition) int {
			return strings.Compare(a.Spec.Names.Kind, b.Spec.Names.Kind)
		},
		"scope": func(a, b apiextensionsv1.CustomResourceDefinition) int {
			return strings.Compare(string(a.Spec.Scope), string(b.Spec.Scope))
		},
		"creationTimestamp": func(a, b apiextensionsv1.CustomResourceDefinition) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"group":             {},
	"kind":              {},
	"scope":             {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":  {},
	"group": {},
	"kind":  {},
	"scope": {},
}
