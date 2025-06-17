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

package configmap

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetConfigMapList(client k8sClient.Interface, namespace string) (*corev1.ConfigMapList, error) {
	klog.V(4).Info("Getting config map list")

	list, err := client.CoreV1().ConfigMaps(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get config map list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetConfigMap(client k8sClient.Interface, namespace, name string) (*corev1.ConfigMap, error) {
	klog.V(4).Infof("Getting config map %s in namespace %s", name, namespace)

	result, err := client.CoreV1().ConfigMaps(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get config map %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return result, nil
}

func CreateConfigMap(client k8sClient.Interface, namespace string, configMap *corev1.ConfigMap) (*corev1.ConfigMap, error) {
	klog.V(4).Infof("Creating config map %s in namespace %s", configMap.Name, namespace)

	result, err := client.CoreV1().ConfigMaps(namespace).Create(context.TODO(), configMap, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create config map %s in namespace %s: %v", configMap.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func UpdateConfigMap(client k8sClient.Interface, namespace string, configMap *corev1.ConfigMap) (*corev1.ConfigMap, error) {
	klog.V(4).Infof("Updating config map %s in namespace %s", configMap.Name, namespace)

	result, err := client.CoreV1().ConfigMaps(namespace).Update(context.TODO(), configMap, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update config map %s in namespace %s: %v", configMap.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func DeleteConfigMap(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting config map %s in namespace %s", name, namespace)

	err := client.CoreV1().ConfigMaps(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete config map %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
