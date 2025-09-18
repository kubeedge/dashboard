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

package ruleendpoint

import (
	"fmt"
	"strings"
	"time"

	rulev1 "github.com/kubeedge/api/apis/rules/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// RuleEndpointListItem represents a simplified RuleEndpoint for list responses
type RuleEndpointListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	RuleEndpointType  string            `json:"ruleEndpointType"`
	Properties        map[string]string `json:"properties,omitempty"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// RuleEndpointToListItem converts a RuleEndpoint to RuleEndpointListItem
func RuleEndpointToListItem(re rulev1.RuleEndpoint) RuleEndpointListItem {
	var ruleEndpointType string
	var properties map[string]string

	if re.Spec.RuleEndpointType != "" {
		ruleEndpointType = string(re.Spec.RuleEndpointType)
	}

	// Extract key properties for display
	properties = make(map[string]string)
	if re.Spec.Properties != nil {
		// Convert properties to string map for display
		for k, v := range re.Spec.Properties {
			properties[k] = fmt.Sprintf("%v", v)
		}
	}

	return RuleEndpointListItem{
		Name:              re.ObjectMeta.Name,
		Namespace:         re.ObjectMeta.Namespace,
		RuleEndpointType:  ruleEndpointType,
		Properties:        properties,
		CreationTimestamp: re.ObjectMeta.CreationTimestamp.Time,
		Labels:            re.ObjectMeta.Labels,
	}
}

// RuleEndpointFieldGetter returns field values for filtering
func RuleEndpointFieldGetter(re rulev1.RuleEndpoint, field string) (string, bool) {
	switch field {
	case "name":
		return re.ObjectMeta.Name, true
	case "namespace":
		return re.ObjectMeta.Namespace, true
	case "ruleEndpointType":
		return string(re.Spec.RuleEndpointType), true
	case "creationTimestamp":
		return re.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// RuleEndpointComparators returns comparison functions for sorting
func RuleEndpointComparators() map[string]common.Comparator[rulev1.RuleEndpoint] {
	return map[string]common.Comparator[rulev1.RuleEndpoint]{
		"name": func(a, b rulev1.RuleEndpoint) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b rulev1.RuleEndpoint) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"ruleEndpointType": func(a, b rulev1.RuleEndpoint) int {
			return strings.Compare(string(a.Spec.RuleEndpointType), string(b.Spec.RuleEndpointType))
		},
		"creationTimestamp": func(a, b rulev1.RuleEndpoint) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"ruleEndpointType":  {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":             {},
	"namespace":        {},
	"ruleEndpointType": {},
}
