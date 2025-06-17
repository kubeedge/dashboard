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

package role

import (
	"context"

	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetRoleList(client k8sClient.Interface, namespace string) (*rbacv1.RoleList, error) {
	klog.V(4).Info("Getting role list")

	list, err := client.RbacV1().Roles(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get role list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetRole(client k8sClient.Interface, namespace, name string) (*rbacv1.Role, error) {
	klog.V(4).Infof("Getting role %s in namespace %s", name, namespace)

	result, err := client.RbacV1().Roles(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get role %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return result, nil
}

func CreateRole(client k8sClient.Interface, namespace string, role *rbacv1.Role) (*rbacv1.Role, error) {
	klog.V(4).Infof("Creating role %s in namespace %s", role.Name, namespace)

	result, err := client.RbacV1().Roles(namespace).Create(context.TODO(), role, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create role %s in namespace %s: %v", role.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func UpdateRole(client k8sClient.Interface, namespace string, role *rbacv1.Role) (*rbacv1.Role, error) {
	klog.V(4).Infof("Updating role %s in namespace %s", role.Name, namespace)

	result, err := client.RbacV1().Roles(namespace).Update(context.TODO(), role, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update role %s in namespace %s: %v", role.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func DeleteRole(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting role %s in namespace %s", name, namespace)

	err := client.RbacV1().Roles(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete role %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
