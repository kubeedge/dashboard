package deployment

import (
	"context"

	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetDeploymentList(client k8sClient.Interface, namespace string) (*appsv1.DeploymentList, error) {
	klog.V(4).Infof("Getting deployment list")

	list, err := client.AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get deployment list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetDeployment(client k8sClient.Interface, namespace, name string) (*appsv1.Deployment, error) {
	klog.V(4).Infof("Getting deployment %s in namespace %s", name, namespace)

	deployment, err := client.AppsV1().Deployments(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get deployment %s: %v", name, err)
		return nil, err
	}

	return deployment, nil
}

func CreateDeployment(client k8sClient.Interface, namespace string, deployment *appsv1.Deployment) (*appsv1.Deployment, error) {
	klog.V(4).Infof("Creating deployment %s in namespace %s", deployment.Name, namespace)

	createdDeployment, err := client.AppsV1().Deployments(namespace).Create(context.TODO(), deployment, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create deployment %s: %v", deployment.Name, err)
		return nil, err
	}

	return createdDeployment, nil
}

func UpdateDeployment(client k8sClient.Interface, namespace string, deployment *appsv1.Deployment) (*appsv1.Deployment, error) {
	klog.V(4).Infof("Updating deployment %s in namespace %s", deployment.Name, namespace)

	updatedDeployment, err := client.AppsV1().Deployments(namespace).Update(context.TODO(), deployment, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update deployment %s: %v", deployment.Name, err)
		return nil, err
	}

	return updatedDeployment, nil
}

func DeleteDeployment(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting deployment %s in namespace %s", name, namespace)

	err := client.AppsV1().Deployments(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete deployment %s: %v", name, err)
		return err
	}

	return nil
}
