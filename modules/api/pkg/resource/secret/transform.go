package secret

import (
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

type SecretListItem struct {
	Name              string `json:"name"`
	Namespace         string `json:"namespace"`
	Type              string `json:"type"`
	CreationTimestamp string `json:"creationTimestamp"`
}

func SecretToListItem(s corev1.Secret) SecretListItem {
	return SecretListItem{
		Name:              s.GetName(),
		Namespace:         s.GetNamespace(),
		Type:              string(s.Type),
		CreationTimestamp: s.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
	}
}

func SecretFieldGetter(s corev1.Secret, field string) (string, bool) {
	switch field {
	case "name":
		return s.GetName(), true
	case "namespace":
		return s.GetNamespace(), true
	case "type":
		return string(s.Type), true
	case "creationTimestamp":
		return s.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func SecretComparators() map[string]listutil.Comparator[corev1.Secret] {
	return map[string]listutil.Comparator[corev1.Secret]{
		"name": func(a, b corev1.Secret) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b corev1.Secret) int {
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
	FilterableFields = map[string]struct{}{"name": {}, "namespace": {}, "type": {}}
)

// GenerateMockSecrets creates mock resources for dev/testing.
func GenerateMockSecrets(n int, namespace string) []corev1.Secret {
	if n < 0 {
		n = 0
	}
	if namespace == "" {
		namespace = "default"
	}
	out := make([]corev1.Secret, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		s := corev1.Secret{}
		s.SetName(fmt.Sprintf("mock-secret-%04d", i))
		s.SetNamespace(namespace)
		s.Type = corev1.SecretTypeOpaque
		s.SetCreationTimestamp(metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)))
		out = append(out, s)
	}
	return out
}
