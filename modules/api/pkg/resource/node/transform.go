package node

import (
	"time"

	corev1 "k8s.io/api/core/v1"

	listutil "github.com/kubeedge/dashboard/api/pkg/resource/common"
)

type NodeListItem struct {
	Name              string `json:"name"`
	UID               string `json:"uid"`
	Status            string `json:"status"`
	Hostname          string `json:"hostname"`
	InternalIP        string `json:"internalIP"`
	CreationTimestamp string `json:"creationTimestamp"`
	KubeletVersion    string `json:"kubeletVersion"`
}

func NodeToListItem(n corev1.Node) NodeListItem {
	return NodeListItem{
		Name:              n.GetName(),
		UID:               string(n.GetUID()),
		Status:            deriveNodeStatus(&n),
		Hostname:          findAddress(&n, "Hostname"),
		InternalIP:        findAddress(&n, "InternalIP"),
		CreationTimestamp: n.GetCreationTimestamp().Time.Format(time.RFC3339Nano),
		KubeletVersion:    n.Status.NodeInfo.KubeletVersion,
	}
}

func NodeFieldGetter(n corev1.Node, field string) (string, bool) {
	switch field {
	case "name":
		return n.GetName(), true
	case "status":
		return deriveNodeStatus(&n), true
	case "creationTimestamp":
		return n.GetCreationTimestamp().Time.Format(time.RFC3339Nano), true
	default:
		return "", false
	}
}

func NodeComparators() map[string]listutil.Comparator[corev1.Node] {
	return map[string]listutil.Comparator[corev1.Node]{
		"name": func(a, b corev1.Node) int {
			if a.GetName() < b.GetName() {
				return -1
			}
			if a.GetName() > b.GetName() {
				return 1
			}
			return 0
		},
		"creationTimestamp": func(a, b corev1.Node) int {
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
	FilterableFields = map[string]struct{}{"name": {}, "status": {}}
)

func deriveNodeStatus(n *corev1.Node) string {
	for _, c := range n.Status.Conditions {
		if c.Type == corev1.NodeReady && c.Status == corev1.ConditionTrue {
			return "Ready"
		}
	}
	return "NotReady"
}

func findAddress(n *corev1.Node, typ string) string {
	for _, a := range n.Status.Addresses {
		if string(a.Type) == typ {
			return a.Address
		}
	}
	return ""
}
