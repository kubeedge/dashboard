package node

import (
	"fmt"
	"time"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
)

func GenerateMockNodes(n int) []corev1.Node {
	if n < 0 {
		n = 0
	}
	out := make([]corev1.Node, 0, n)
	now := time.Now().UTC()
	for i := 1; i <= n; i++ {
		name := fmt.Sprintf("mock-node-%04d", i)
		ready := corev1.ConditionFalse
		if i%3 != 0 {
			ready = corev1.ConditionTrue
		}
		out = append(out, corev1.Node{
			ObjectMeta: metav1.ObjectMeta{
				Name:              name,
				UID:               types.UID("uid-" + name),
				CreationTimestamp: metav1.NewTime(now.Add(-time.Duration(i) * time.Minute)),
			},
			Status: corev1.NodeStatus{
				Addresses: []corev1.NodeAddress{
					{Type: corev1.NodeHostName, Address: name + ".local"},
					{Type: corev1.NodeInternalIP, Address: fmt.Sprintf("10.0.%d.%d", (i/255)%255, i%255)},
				},
				Conditions: []corev1.NodeCondition{{Type: corev1.NodeReady, Status: ready}},
				NodeInfo:   corev1.NodeSystemInfo{KubeletVersion: "v1.32.0"},
			},
		})
	}
	return out
}
