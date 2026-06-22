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

package serviceaccount

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetServiceAccountList(client k8sClient.Interface, namespace string) (*corev1.ServiceAccountList, error) {
	klog.V(4).Info("Getting service account list")

	list, err := client.CoreV1().ServiceAccounts(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get service account list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetServiceAccount(client k8sClient.Interface, namespace, name string) (*corev1.ServiceAccount, error) {
	klog.V(4).Infof("Getting service account %s in namespace %s", name, namespace)

	serviceAccount, err := client.CoreV1().ServiceAccounts(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get service account %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return serviceAccount, nil
}

func CreateServiceAccount(client k8sClient.Interface, namespace string, serviceAccount *corev1.ServiceAccount) (*corev1.ServiceAccount, error) {
	klog.V(4).Infof("Creating service account %s in namespace %s", serviceAccount.Name, namespace)

	createdServiceAccount, err := client.CoreV1().ServiceAccounts(namespace).Create(context.TODO(), serviceAccount, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create service account %s in namespace %s: %v", serviceAccount.Name, namespace, err)
		return nil, err
	}

	return createdServiceAccount, nil
}

func UpdateServiceAccount(client k8sClient.Interface, namespace string, serviceAccount *corev1.ServiceAccount) (*corev1.ServiceAccount, error) {
	klog.V(4).Infof("Updating service account %s in namespace %s", serviceAccount.Name, namespace)

	updatedServiceAccount, err := client.CoreV1().ServiceAccounts(namespace).Update(context.TODO(), serviceAccount, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update service account %s in namespace %s: %v", serviceAccount.Name, namespace, err)
		return nil, err
	}

	return updatedServiceAccount, nil
}

func DeleteServiceAccount(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting service account %s in namespace %s", name, namespace)

	err := client.CoreV1().ServiceAccounts(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete service account %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
