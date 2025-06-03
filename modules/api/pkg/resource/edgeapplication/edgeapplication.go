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

package edgeapplication

import (
	"context"

	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetEdgeApplicationList(client kubeedgeClient.Interface, namespace string) (*appsv1alpha1.EdgeApplicationList, error) {
	klog.V(4).Infof("Getting edge application list")

	list, err := client.AppsV1alpha1().EdgeApplications(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get edge application list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetEdgeApplication(client kubeedgeClient.Interface, namespace, name string) (*appsv1alpha1.EdgeApplication, error) {
	klog.V(4).Infof("Getting edge application %s in namespace %s", name, namespace)

	edgeApplication, err := client.AppsV1alpha1().EdgeApplications(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get edge application %s: %v", name, err)
		return nil, err
	}

	return edgeApplication, nil
}

func CreateEdgeApplication(client kubeedgeClient.Interface, namespace string, edgeApplication *appsv1alpha1.EdgeApplication) (*appsv1alpha1.EdgeApplication, error) {
	klog.V(4).Infof("Creating edge application %s in namespace %s", edgeApplication.Name, namespace)

	createdEdgeApplication, err := client.AppsV1alpha1().EdgeApplications(namespace).Create(context.TODO(), edgeApplication, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create edge application %s: %v", edgeApplication.Name, err)
		return nil, err
	}

	return createdEdgeApplication, nil
}

func UpdateEdgeApplication(client kubeedgeClient.Interface, namespace string, edgeApplication *appsv1alpha1.EdgeApplication) (*appsv1alpha1.EdgeApplication, error) {
	klog.V(4).Infof("Updating edge application %s in namespace %s", edgeApplication.Name, namespace)

	updatedEdgeApplication, err := client.AppsV1alpha1().EdgeApplications(namespace).Update(context.TODO(), edgeApplication, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update edge application %s: %v", edgeApplication.Name, err)
		return nil, err
	}

	return updatedEdgeApplication, nil
}

func DeleteEdgeApplication(client kubeedgeClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting edge application %s in namespace %s", name, namespace)

	err := client.AppsV1alpha1().EdgeApplications(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete edge application %s: %v", name, err)
		return err
	}

	return nil
}
