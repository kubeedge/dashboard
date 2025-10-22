package nodegroup

import (
	"fmt"
	"time"

	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

type NodeGroupListItem struct {
	Name              string `json:"name"`
	Namespace         string `json:"namespace"`
	CreationTimestamp string `json:"creationTimestamp"`
}

func NodeGroupToListItem(ng appsv1alpha1.NodeGroup) NodeGroupListItem {
	return NodeGroupListItem{
		Name:              ng.GetName(),
		Namespace:         ng.GetNamespace(),
		CreationTimestamp: ng.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
	}
}

func NodeGroupFieldGetter(ng appsv1alpha1.NodeGroup, field string) (string, bool) {
	switch field {
	case "name":
		return ng.GetName(), true
	case "namespace":
		return ng.GetNamespace(), true
	case "creationTimestamp":
		return ng.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func NodeGroupComparators() map[string]listutil.Comparator[appsv1alpha1.NodeGroup] {
	return map[string]listutil.Comparator[appsv1alpha1.NodeGroup]{
		"name": func(a, b appsv1alpha1.NodeGroup) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b appsv1alpha1.NodeGroup) int {
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
	NodeGroupSortableFields   = map[string]struct{}{"name": {}, "creationTimestamp": {}}
	NodeGroupFilterableFields = map[string]struct{}{"name": {}, "namespace": {}}
)

func GenerateMockNodeGroups(n int) []appsv1alpha1.NodeGroup {
	if n < 0 {
		n = 0
	}
	out := make([]appsv1alpha1.NodeGroup, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		ng := appsv1alpha1.NodeGroup{}
		ng.SetName(fmt.Sprintf("mock-ng-%04d", i))
		ng.SetNamespace("default")
		ng.SetCreationTimestamp(metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)))
		out = append(out, ng)
	}
	return out
}
