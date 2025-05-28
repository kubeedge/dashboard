package nodegroup

import (
	"context"

	appsv1alpha1 "github.com/kubeedge/api/apis/apps/v1alpha1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetNodeGroupList(client kubeedgeClient.Interface) (*appsv1alpha1.NodeGroupList, error) {
	klog.V(4).Infof("Getting node group list")

	list, err := client.AppsV1alpha1().NodeGroups().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get node group list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetNodeGroup(client kubeedgeClient.Interface, name string) (*appsv1alpha1.NodeGroup, error) {
	klog.V(4).Infof("Getting node group %s", name)

	nodeGroup, err := client.AppsV1alpha1().NodeGroups().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get node group %s: %v", name, err)
		return nil, err
	}

	return nodeGroup, nil
}

func CreateNodeGroup(client kubeedgeClient.Interface, nodeGroup *appsv1alpha1.NodeGroup) (*appsv1alpha1.NodeGroup, error) {
	klog.V(4).Infof("Creating node group %s", nodeGroup.Name)

	createdNodeGroup, err := client.AppsV1alpha1().NodeGroups().Create(context.TODO(), nodeGroup, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create node group %s: %v", nodeGroup.Name, err)
		return nil, err
	}

	return createdNodeGroup, nil
}

func UpdateNodeGroup(client kubeedgeClient.Interface, nodeGroup *appsv1alpha1.NodeGroup) (*appsv1alpha1.NodeGroup, error) {
	klog.V(4).Infof("Updating node group %s", nodeGroup.Name)

	updatedNodeGroup, err := client.AppsV1alpha1().NodeGroups().Update(context.TODO(), nodeGroup, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update node group %s: %v", nodeGroup.Name, err)
		return nil, err
	}

	return updatedNodeGroup, nil
}

func DeleteNodeGroup(client kubeedgeClient.Interface, name string) error {
	klog.V(4).Infof("Deleting node group %s", name)

	err := client.AppsV1alpha1().NodeGroups().Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete node group %s: %v", name, err)
		return err
	}

	return nil
}
