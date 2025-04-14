package clusterrolebinding

import (
	"context"

	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetClusterRoleBindingList(client k8sClient.Interface) (*rbacv1.ClusterRoleBindingList, error) {
	klog.V(4).Infof("Getting cluster role binding list")

	list, err := client.RbacV1().ClusterRoleBindings().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get cluster role binding list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetClusterRoleBinding(client k8sClient.Interface, name string) (*rbacv1.ClusterRoleBinding, error) {
	klog.V(4).Infof("Getting cluster role binding %s", name)

	result, err := client.RbacV1().ClusterRoleBindings().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get cluster role binding %s: %v", name, err)
		return nil, err
	}

	return result, nil
}

func CreateClusterRoleBinding(client k8sClient.Interface, clusterRoleBinding *rbacv1.ClusterRoleBinding) (*rbacv1.ClusterRoleBinding, error) {
	klog.V(4).Infof("Creating cluster role binding %s", clusterRoleBinding.Name)

	result, err := client.RbacV1().ClusterRoleBindings().Create(context.TODO(), clusterRoleBinding, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create cluster role binding %s: %v", clusterRoleBinding.Name, err)
		return nil, err
	}

	return result, nil
}

func UpdateClusterRoleBinding(client k8sClient.Interface, clusterRoleBinding *rbacv1.ClusterRoleBinding) (*rbacv1.ClusterRoleBinding, error) {
	klog.V(4).Infof("Updating cluster role binding %s", clusterRoleBinding.Name)

	result, err := client.RbacV1().ClusterRoleBindings().Update(context.TODO(), clusterRoleBinding, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update cluster role binding %s: %v", clusterRoleBinding.Name, err)
		return nil, err
	}

	return result, nil
}

func DeleteClusterRoleBinding(client k8sClient.Interface, name string) error {
	klog.V(4).Infof("Deleting cluster role binding %s", name)

	err := client.RbacV1().ClusterRoleBindings().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete cluster role binding %s: %v", name, err)
		return err
	}

	return nil
}
