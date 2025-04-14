package secret

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetSecretList(client k8sClient.Interface, namespace string) (*corev1.SecretList, error) {
	klog.V(4).Infof("Getting secret list")

	list, err := client.CoreV1().Secrets(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get secret list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetSecret(client k8sClient.Interface, namespace, name string) (*corev1.Secret, error) {
	klog.V(4).Infof("Getting secret %s in namespace %s", name, namespace)

	result, err := client.CoreV1().Secrets(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get secret %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return result, nil
}

func CreateSecret(client k8sClient.Interface, namespace string, secret *corev1.Secret) (*corev1.Secret, error) {
	klog.V(4).Infof("Creating secret %s in namespace %s", secret.Name, namespace)

	result, err := client.CoreV1().Secrets(namespace).Create(context.TODO(), secret, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create secret %s in namespace %s: %v", secret.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func UpdateSecret(client k8sClient.Interface, namespace string, secret *corev1.Secret) (*corev1.Secret, error) {
	klog.V(4).Infof("Updating secret %s in namespace %s", secret.Name, namespace)

	result, err := client.CoreV1().Secrets(namespace).Update(context.TODO(), secret, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update secret %s in namespace %s: %v", secret.Name, namespace, err)
		return nil, err
	}

	return result, nil
}

func DeleteSecret(client k8sClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting secret %s in namespace %s", name, namespace)

	err := client.CoreV1().Secrets(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete secret %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
