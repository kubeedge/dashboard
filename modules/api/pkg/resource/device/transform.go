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

package device

import (
	"strings"
	"time"

	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// DeviceListItem represents a simplified Device for list responses
type DeviceListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	DeviceModelRef    string            `json:"deviceModelRef"`
	NodeName          string            `json:"nodeName"`
	NodeSelector      string            `json:"nodeSelector"`
	Protocol          string            `json:"protocol"`
	Status            string            `json:"status"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// DeviceToListItem converts a Device to DeviceListItem
func DeviceToListItem(d devicev1beta1.Device) DeviceListItem {
	var deviceModelRef string
	if d.Spec.DeviceModelRef != nil {
		deviceModelRef = d.Spec.DeviceModelRef.Name
	}

	// Note: NodeSelector field structure may vary in the actual API
	nodeSelector := "unknown"

	status := "Unknown"
	if len(d.Status.Twins) > 0 {
		status = "Connected"
	}

	return DeviceListItem{
		Name:              d.ObjectMeta.Name,
		Namespace:         d.ObjectMeta.Namespace,
		DeviceModelRef:    deviceModelRef,
		NodeName:          d.Spec.NodeName,
		NodeSelector:      nodeSelector,
		Protocol:          d.Spec.Protocol.ProtocolName,
		Status:            status,
		CreationTimestamp: d.ObjectMeta.CreationTimestamp.Time,
		Labels:            d.ObjectMeta.Labels,
	}
}

// DeviceFieldGetter returns field values for filtering
func DeviceFieldGetter(d devicev1beta1.Device, field string) (string, bool) {
	switch field {
	case "name":
		return d.ObjectMeta.Name, true
	case "namespace":
		return d.ObjectMeta.Namespace, true
	case "deviceModelRef":
		if d.Spec.DeviceModelRef != nil {
			return d.Spec.DeviceModelRef.Name, true
		}
		return "", true
	case "nodeSelector":
		// Note: NodeSelector field structure may vary in the actual API
		return "unknown", true
	case "status":
		if len(d.Status.Twins) > 0 {
			return "Connected", true
		}
		return "Unknown", true
	case "creationTimestamp":
		return d.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// DeviceComparators returns comparison functions for sorting
func DeviceComparators() map[string]common.Comparator[devicev1beta1.Device] {
	return map[string]common.Comparator[devicev1beta1.Device]{
		"name": func(a, b devicev1beta1.Device) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b devicev1beta1.Device) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"deviceModelRef": func(a, b devicev1beta1.Device) int {
			aRef := ""
			if a.Spec.DeviceModelRef != nil {
				aRef = a.Spec.DeviceModelRef.Name
			}
			bRef := ""
			if b.Spec.DeviceModelRef != nil {
				bRef = b.Spec.DeviceModelRef.Name
			}
			return strings.Compare(aRef, bRef)
		},
		"creationTimestamp": func(a, b devicev1beta1.Device) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"deviceModelRef":    {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":           {},
	"namespace":      {},
	"deviceModelRef": {},
	"nodeSelector":   {},
	"status":         {},
}
