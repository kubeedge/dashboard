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

package devicemodel

import (
	"strings"
	"time"

	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// DeviceModelListItem represents a simplified DeviceModel for list responses
type DeviceModelListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Protocol          string            `json:"protocol"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// DeviceModelToListItem converts a DeviceModel to DeviceModelListItem
func DeviceModelToListItem(dm devicev1beta1.DeviceModel) DeviceModelListItem {
	return DeviceModelListItem{
		Name:              dm.ObjectMeta.Name,
		Namespace:         dm.ObjectMeta.Namespace,
		Protocol:          dm.Spec.Protocol,
		CreationTimestamp: dm.ObjectMeta.CreationTimestamp.Time,
		Labels:            dm.ObjectMeta.Labels,
	}
}

// DeviceModelFieldGetter returns field values for filtering
func DeviceModelFieldGetter(dm devicev1beta1.DeviceModel, field string) (string, bool) {
	switch field {
	case "name":
		return dm.ObjectMeta.Name, true
	case "namespace":
		return dm.ObjectMeta.Namespace, true
	case "protocol":
		return dm.Spec.Protocol, true
	case "creationTimestamp":
		return dm.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// DeviceModelComparators returns comparison functions for sorting
func DeviceModelComparators() map[string]common.Comparator[devicev1beta1.DeviceModel] {
	return map[string]common.Comparator[devicev1beta1.DeviceModel]{
		"name": func(a, b devicev1beta1.DeviceModel) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b devicev1beta1.DeviceModel) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"protocol": func(a, b devicev1beta1.DeviceModel) int {
			return strings.Compare(a.Spec.Protocol, b.Spec.Protocol)
		},
		"creationTimestamp": func(a, b devicev1beta1.DeviceModel) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"protocol":          {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":      {},
	"namespace": {},
	"protocol":  {},
}
