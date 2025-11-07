package deployment

import (
	"fmt"
	"time"

	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

// DeploymentListItem is the lightweight view returned by list API.
type DeploymentListItem struct {
	Name              string `json:"name"`
	Namespace         string `json:"namespace"`
	CreationTimestamp string `json:"creationTimestamp"`
	Replicas          int32  `json:"replicas"`
	AvailableReplicas int32  `json:"availableReplicas"`
}

func DeploymentToListItem(d appsv1.Deployment) DeploymentListItem {
	return DeploymentListItem{
		Name:              d.GetName(),
		Namespace:         d.GetNamespace(),
		CreationTimestamp: d.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
		Replicas:          d.Status.Replicas,
		AvailableReplicas: d.Status.AvailableReplicas,
	}
}

func DeploymentFieldGetter(d appsv1.Deployment, field string) (string, bool) {
	switch field {
	case "name":
		return d.GetName(), true
	case "namespace":
		return d.GetNamespace(), true
	case "creationTimestamp":
		return d.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func DeploymentComparators() map[string]listutil.Comparator[appsv1.Deployment] {
	return map[string]listutil.Comparator[appsv1.Deployment]{
		"name": func(a, b appsv1.Deployment) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b appsv1.Deployment) int {
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

// GenerateMockDeployments creates n fake deployments for dev/testing.
func GenerateMockDeployments(n int, namespace string) []appsv1.Deployment {
	if n < 0 {
		n = 0
	}
	if namespace == "" {
		namespace = "default"
	}
	out := make([]appsv1.Deployment, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		name := fmt.Sprintf("mock-deploy-%04d", i)
		d := appsv1.Deployment{}
		d.SetName(name)
		d.SetNamespace(namespace)
		d.SetCreationTimestamp(metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)))
		total := int32((i % 5) + 1)
		available := total - int32(i%2)
		if available < 0 {
			available = 0
		}
		d.Status.Replicas = total
		d.Status.AvailableReplicas = available
		out = append(out, d)
	}
	return out
}
