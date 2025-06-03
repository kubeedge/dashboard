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

package rolebinding

import (
	"context"

	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetRoleBindingList(client k8sClient.Interface, namespace string) (*rbacv1.RoleBindingList, error) {
	klog.V(4).Infof("Getting role binding list")

	list, err := client.RbacV1().RoleBindings(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get role binding list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetRoleBinding(client k8sClient.Interface, namespace, name string) (*rbacv1.RoleBinding, error) {
	klog.V(4).Infof("Getting role binding %s in namespace %s", name, namespace)

	roleBinding, err := client.RbacV1().RoleBindings(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get role binding %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return roleBinding, nil
}

func CreateRoleBinding(client k8sClient.Interface, namespace string, roleBinding *rbacv1.RoleBinding) (*rbacv1.RoleBinding, error) {
	klog.V(4).Infof("Creating role binding %s in namespace %s", roleBinding.Name, namespace)

	createdRoleBinding, err := client.RbacV1().RoleBindings(namespace).Create(context.TODO(), roleBinding, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create role binding %s in namespace %s: %v", roleBinding.Name, namespace, err)
		return nil, err
	}

	return createdRoleBinding, nil
}

func UpdateRoleBinding(client k8sClient.Interface, namespace string, roleBinding *rbacv1.RoleBinding) (*rbacv1.RoleBinding, error) {
	klog.V(4).Infof("Updating role binding %s in namespace %s", roleBinding.Name, namespace)

	updatedRoleBinding, err := client.RbacV1().RoleBindings(namespace).Update(context.TODO(), roleBinding, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update role binding %s in namespace %s: %v", roleBinding.Name, namespace, err)
		return nil, err
	}

	return updatedRoleBinding, nil
}

func DeleteRoleBinding(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting role binding %s in namespace %s", name, namespace)

	err := client.RbacV1().RoleBindings(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete role binding %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
