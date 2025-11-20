package edgeapplication

import (
	"fmt"
	"strings"
	"time"

	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

type EdgeApplicationListItem struct {
	Name              string `json:"name"`
	Namespace         string `json:"namespace"`
	CreationTimestamp string `json:"creationTimestamp"`
	NodeGroups        string `json:"nodeGroups,omitempty"`
}

func EdgeApplicationToListItem(ea appsv1alpha1.EdgeApplication) EdgeApplicationListItem {
	nodeGroups := ""
	if len(ea.Spec.WorkloadScope.TargetNodeGroups) > 0 {
		groupNames := make([]string, 0, len(ea.Spec.WorkloadScope.TargetNodeGroups))
		for _, group := range ea.Spec.WorkloadScope.TargetNodeGroups {
			groupNames = append(groupNames, group.Name)
		}
		nodeGroups = strings.Join(groupNames, ", ")
	}

	return EdgeApplicationListItem{
		Name:              ea.GetName(),
		Namespace:         ea.GetNamespace(),
		CreationTimestamp: ea.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
		NodeGroups:        nodeGroups,
	}
}

func EdgeApplicationFieldGetter(ea appsv1alpha1.EdgeApplication, field string) (string, bool) {
	switch field {
	case "name":
		return ea.GetName(), true
	case "namespace":
		return ea.GetNamespace(), true
	case "creationTimestamp":
		return ea.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func EdgeApplicationComparators() map[string]listutil.Comparator[appsv1alpha1.EdgeApplication] {
	return map[string]listutil.Comparator[appsv1alpha1.EdgeApplication]{
		"name": func(a, b appsv1alpha1.EdgeApplication) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b appsv1alpha1.EdgeApplication) int {
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

// GenerateMockEdgeApplications creates mock resources for dev/testing.
func GenerateMockEdgeApplications(n int, namespace string) []appsv1alpha1.EdgeApplication {
	if n < 0 {
		n = 0
	}
	if namespace == "" {
		namespace = "default"
	}
	out := make([]appsv1alpha1.EdgeApplication, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		ea := appsv1alpha1.EdgeApplication{}
		ea.SetName(fmt.Sprintf("mock-ea-%04d", i))
		ea.SetNamespace(namespace)
		ea.SetCreationTimestamp(metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)))
		out = append(out, ea)
	}
	return out
}
