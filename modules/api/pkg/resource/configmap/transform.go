package configmap

import (
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// ConfigMapListItem is the lightweight view returned by list API.
type ConfigMapListItem struct {
	Name              string            `json:"name"`
	Namespace         string            `json:"namespace"`
	CreationTimestamp string            `json:"creationTimestamp"`
	Labels            map[string]string `json:"labels,omitempty"`
}

func ConfigMapToListItem(cm corev1.ConfigMap) ConfigMapListItem {
	return ConfigMapListItem{
		Name:              cm.GetName(),
		Namespace:         cm.GetNamespace(),
		CreationTimestamp: cm.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
		Labels:            cm.GetLabels(),
	}
}

func ConfigMapFieldGetter(cm corev1.ConfigMap, field string) (string, bool) {
	switch field {
	case "name":
		return cm.GetName(), true
	case "namespace":
		return cm.GetNamespace(), true
	case "creationTimestamp":
		return cm.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func ConfigMapComparators() map[string]listutil.Comparator[corev1.ConfigMap] {
	return map[string]listutil.Comparator[corev1.ConfigMap]{
		"name": func(a, b corev1.ConfigMap) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b corev1.ConfigMap) int {
			at := a.GetCreationTimestamp().Time
			bt := b.GetCreationTimestamp().Time
			if at.Before(bt) {
				return -1
			}
			if at.After(bt) {
				return 1
			}
			return 0
		},
	}
}

var (
	SortableFields   = map[string]struct{}{"name": {}, "creationTimestamp": {}}
	FilterableFields = map[string]struct{}{"name": {}, "namespace": {}}
)

// GenerateMockConfigMaps creates mock resources for dev/testing.
func GenerateMockConfigMaps(n int, namespace string) []corev1.ConfigMap {
	if n < 0 {
		n = 0
	}
	if namespace == "" {
		namespace = "default"
	}
	out := make([]corev1.ConfigMap, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		cm := corev1.ConfigMap{}
		cm.SetName(fmt.Sprintf("mock-cm-%04d", i))
		cm.SetNamespace(namespace)
		cm.SetCreationTimestamp(metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)))
		out = append(out, cm)
	}
	return out
}
