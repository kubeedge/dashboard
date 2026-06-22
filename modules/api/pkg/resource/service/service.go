/*
Copyright 2025 The KubeEdge Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package service

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetServiceList(client k8sClient.Interface, namespace string) (*corev1.ServiceList, error) {
	klog.V(4).Info("Getting service list")

	list, err := client.CoreV1().Services(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get service list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetService(client k8sClient.Interface, namespace, name string) (*corev1.Service, error) {
	klog.V(4).Infof("Getting service %s in namespace %s", name, namespace)

	service, err := client.CoreV1().Services(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get service %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return service, nil
}

func CreateService(client k8sClient.Interface, namespace string, service *corev1.Service) (*corev1.Service, error) {
	klog.V(4).Infof("Creating service %s in namespace %s", service.Name, namespace)

	createdService, err := client.CoreV1().Services(namespace).Create(context.TODO(), service, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create service %s in namespace %s: %v", service.Name, namespace, err)
		return nil, err
	}

	return createdService, nil
}

func UpdateService(client k8sClient.Interface, namespace string, service *corev1.Service) (*corev1.Service, error) {
	klog.V(4).Infof("Updating service %s in namespace %s", service.Name, namespace)

	updatedService, err := client.CoreV1().Services(namespace).Update(context.TODO(), service, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update service %s in namespace %s: %v", service.Name, namespace, err)
		return nil, err
	}

	return updatedService, nil
}

func DeleteService(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting service %s in namespace %s", name, namespace)

	err := client.CoreV1().Services(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete service %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
