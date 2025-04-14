package clusterrole

import (
	"context"

	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetClusterRoleList(client k8sClient.Interface) (*rbacv1.ClusterRoleList, error) {
	klog.V(4).Infof("Getting cluster role list")

	list, err := client.RbacV1().ClusterRoles().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get cluster role list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetClusterRole(client k8sClient.Interface, name string) (*rbacv1.ClusterRole, error) {
	klog.V(4).Infof("Getting cluster role %s", name)

	result, err := client.RbacV1().ClusterRoles().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get cluster role %s: %v", name, err)
		return nil, err
	}

	return result, nil
}

func CreateClusterRole(client k8sClient.Interface, clusterRole *rbacv1.ClusterRole) (*rbacv1.ClusterRole, error) {
	klog.V(4).Infof("Creating cluster role %s", clusterRole.Name)

	result, err := client.RbacV1().ClusterRoles().Create(context.TODO(), clusterRole, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create cluster role %s: %v", clusterRole.Name, err)
		return nil, err
	}

	return result, nil
}

func UpdateClusterRole(client k8sClient.Interface, clusterRole *rbacv1.ClusterRole) (*rbacv1.ClusterRole, error) {
	klog.V(4).Infof("Updating cluster role %s", clusterRole.Name)

	result, err := client.RbacV1().ClusterRoles().Update(context.TODO(), clusterRole, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update cluster role %s: %v", clusterRole.Name, err)
		return nil, err
	}

	return result, nil
}

func DeleteClusterRole(client k8sClient.Interface, name string) error {
	klog.V(4).Infof("Deleting cluster role %s", name)

	err := client.RbacV1().ClusterRoles().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete cluster role %s: %v", name, err)
		return err
	}

	return nil
}
