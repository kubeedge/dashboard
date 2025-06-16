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

package node

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetNodeList(client k8sClient.Interface) (*corev1.NodeList, error) {
	klog.V(4).Info("Getting node list")

	list, err := client.CoreV1().Nodes().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get node list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetNode(client k8sClient.Interface, name string) (*corev1.Node, error) {
	klog.V(4).Infof("Getting node %s", name)

	result, err := client.CoreV1().Nodes().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get node %s: %v", name, err)
		return nil, err
	}

	return result, nil
}

func UpdateNode(client k8sClient.Interface, node *corev1.Node) (*corev1.Node, error) {
	klog.V(4).Infof("Updating node %s", node.Name)

	result, err := client.CoreV1().Nodes().Update(context.TODO(), node, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update node %s: %v", node.Name, err)
		return nil, err
	}

	return result, nil
}

func DeleteNode(client k8sClient.Interface, name string) error {
	klog.V(4).Infof("Deleting node %s", name)

	err := client.CoreV1().Nodes().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete node %s: %v", name, err)
		return err
	}

	return nil
}
