package common

import (
    k8sClient "k8s.io/client-go/kubernetes"
    "k8s.io/klog/v2"
)

type HealthStatus struct {
    Healthy           bool   `json:"healthy"`
    KubernetesVersion string `json:"kubernetesVersion,omitempty"`
}

func GetHealth(client k8sClient.Interface) (*HealthStatus, error) {
    klog.V(4).Info("Checking dashboard API health")

    ver, err := client.Discovery().ServerVersion()
    if err != nil {
        klog.Errorf("Health check failed: %v", err)
        return nil, err
    }

    return &HealthStatus{
        Healthy:           true,
        KubernetesVersion: ver.GitVersion,
    }, nil
}