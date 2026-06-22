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

package service

import (
	"fmt"
	"strings"
	"time"

	corev1 "k8s.io/api/core/v1"

	"github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// ServiceListItem represents a simplified Service for list responses
type ServiceListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	Type              string            `json:"type"`
	ClusterIP         string            `json:"clusterIP"`
	ExternalIP        string            `json:"externalIP"`
	Ports             []string          `json:"ports"`
	Age               string            `json:"age"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

// ServiceToListItem converts a Service to ServiceListItem
func ServiceToListItem(s corev1.Service) ServiceListItem {
	var ports []string
	for _, port := range s.Spec.Ports {
		portStr := fmt.Sprintf("%d", port.Port)
		if port.Protocol != "" && port.Protocol != corev1.ProtocolTCP {
			portStr += "/" + string(port.Protocol)
		}
		if port.Name != "" {
			portStr = port.Name + ":" + portStr
		}
		ports = append(ports, portStr)
	}

	var externalIP string
	if len(s.Spec.ExternalIPs) > 0 {
		externalIP = strings.Join(s.Spec.ExternalIPs, ",")
	} else if s.Spec.Type == corev1.ServiceTypeLoadBalancer {
		if len(s.Status.LoadBalancer.Ingress) > 0 {
			if s.Status.LoadBalancer.Ingress[0].IP != "" {
				externalIP = s.Status.LoadBalancer.Ingress[0].IP
			} else if s.Status.LoadBalancer.Ingress[0].Hostname != "" {
				externalIP = s.Status.LoadBalancer.Ingress[0].Hostname
			}
		}
	}

	age := time.Since(s.ObjectMeta.CreationTimestamp.Time).Truncate(time.Second).String()

	return ServiceListItem{
		Name:              s.ObjectMeta.Name,
		Namespace:         s.ObjectMeta.Namespace,
		Type:              string(s.Spec.Type),
		ClusterIP:         s.Spec.ClusterIP,
		ExternalIP:        externalIP,
		Ports:             ports,
		Age:               age,
		CreationTimestamp: s.ObjectMeta.CreationTimestamp.Time,
		Labels:            s.ObjectMeta.Labels,
	}
}

// ServiceFieldGetter returns field values for filtering
func ServiceFieldGetter(s corev1.Service, field string) (string, bool) {
	switch field {
	case "name":
		return s.ObjectMeta.Name, true
	case "namespace":
		return s.ObjectMeta.Namespace, true
	case "type":
		return string(s.Spec.Type), true
	case "clusterIP":
		return s.Spec.ClusterIP, true
	case "externalIP":
		if len(s.Spec.ExternalIPs) > 0 {
			return strings.Join(s.Spec.ExternalIPs, ","), true
		}
		return "", true
	case "creationTimestamp":
		return s.ObjectMeta.CreationTimestamp.Format(time.RFC3339), true
	default:
		return "", false
	}
}

// ServiceComparators returns comparison functions for sorting
func ServiceComparators() map[string]common.Comparator[corev1.Service] {
	return map[string]common.Comparator[corev1.Service]{
		"name": func(a, b corev1.Service) int {
			return strings.Compare(a.ObjectMeta.Name, b.ObjectMeta.Name)
		},
		"namespace": func(a, b corev1.Service) int {
			return strings.Compare(a.ObjectMeta.Namespace, b.ObjectMeta.Namespace)
		},
		"type": func(a, b corev1.Service) int {
			return strings.Compare(string(a.Spec.Type), string(b.Spec.Type))
		},
		"clusterIP": func(a, b corev1.Service) int {
			return strings.Compare(a.Spec.ClusterIP, b.Spec.ClusterIP)
		},
		"creationTimestamp": func(a, b corev1.Service) int {
			return a.ObjectMeta.CreationTimestamp.Time.Compare(b.ObjectMeta.CreationTimestamp.Time)
		},
	}
}

// SortableFields defines which fields can be used for sorting
var SortableFields = map[string]struct{}{
	"name":              {},
	"namespace":         {},
	"type":              {},
	"clusterIP":         {},
	"creationTimestamp": {},
}

// FilterableFields defines which fields can be used for filtering
var FilterableFields = map[string]struct{}{
	"name":       {},
	"namespace":  {},
	"type":       {},
	"clusterIP":  {},
	"externalIP": {},
}
