package pod

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetPodList(client k8sClient.Interface, namespace string) (*corev1.PodList, error) {
	klog.V(4).Infof("Getting pod list")

	list, err := client.CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get pod list: %v", err)
		return nil, err
	}

	return list, nil
}
