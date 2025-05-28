package common

import (
	"k8s.io/apimachinery/pkg/version"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetVersion(client k8sClient.Interface) (*version.Info, error) {
	klog.V(4).Infof("Getting kubernetes version")

	version, err := client.Discovery().ServerVersion()
	if err != nil {
		klog.Errorf("Failed to get kubernetes version: %v", err)
		return nil, err
	}

	return version, nil
}
