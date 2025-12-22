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

package rule

import (
	"fmt"
	"strings"
	"time"

	rulev1 "github.com/kubeedge/api/apis/rules/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// RuleListItem represents a simplified Rule for list responses
type RuleListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Source            string            `json:"source"`
	SourceResource    map[string]string `json:"sourceResource"`
	Target            string            `json:"target"`
	TargetResource    map[string]string `json:"targetResource"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// RuleToListItem converts a Rule to RuleListItem
func RuleToListItem(r rulev1.Rule) RuleListItem {
	return RuleListItem{
		Name:              r.ObjectMeta.Name,
		Namespace:         r.ObjectMeta.Namespace,
		Source:            r.Spec.Source,
		SourceResource:    r.Spec.SourceResource,
		Target:            r.Spec.Target,
		TargetResource:    r.Spec.TargetResource,
		CreationTimestamp: r.ObjectMeta.CreationTimestamp.Time,
		Labels:            r.ObjectMeta.Labels,
	}
}

// RuleFieldGetter returns field values for filtering
func RuleFieldGetter(r rulev1.Rule, field string) (string, bool) {
	switch field {
	case "name":
		return r.ObjectMeta.Name, true
	case "namespace":
		return r.ObjectMeta.Namespace, true
	case "source":
		return r.Spec.Source, true
	case "target":
		return r.Spec.Target, true
	case "sourceResource":
		return fmt.Sprintf("%v", r.Spec.SourceResource), true
	case "targetResource":
		return fmt.Sprintf("%v", r.Spec.TargetResource), true
	case "creationTimestamp":
		return r.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// RuleComparators returns comparison functions for sorting
func RuleComparators() map[string]common.Comparator[rulev1.Rule] {
	return map[string]common.Comparator[rulev1.Rule]{
		"name": func(a, b rulev1.Rule) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b rulev1.Rule) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"source": func(a, b rulev1.Rule) int {
			return strings.Compare(a.Spec.Source, b.Spec.Source)
		},
		"target": func(a, b rulev1.Rule) int {
			return strings.Compare(a.Spec.Target, b.Spec.Target)
		},
		"creationTimestamp": func(a, b rulev1.Rule) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"source":            {},
	"target":            {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":           {},
	"namespace":      {},
	"source":         {},
	"target":         {},
	"sourceResource": {},
	"targetResource": {},
}
