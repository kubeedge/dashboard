package devicemodel

import (
	"context"

	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetDeviceModelList(client kubeedgeClient.Interface, namespace string) (*devicev1beta1.DeviceModelList, error) {
	klog.V(4).Infof("Getting device model list")

	list, err := client.DevicesV1beta1().DeviceModels(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get device model list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetDeviceModel(client kubeedgeClient.Interface, namespace, name string) (*devicev1beta1.DeviceModel, error) {
	klog.V(4).Infof("Getting device model %s in namespace %s", name, namespace)

	deviceModel, err := client.DevicesV1beta1().DeviceModels(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get device model %s: %v", name, err)
		return nil, err
	}

	return deviceModel, nil
}

func CreateDeviceModel(client kubeedgeClient.Interface, namespace string, deviceModel *devicev1beta1.DeviceModel) (*devicev1beta1.DeviceModel, error) {
	klog.V(4).Infof("Creating device model %s in namespace %s", deviceModel.Name, namespace)

	createdDeviceModel, err := client.DevicesV1beta1().DeviceModels(namespace).Create(context.TODO(), deviceModel, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create device model %s: %v", deviceModel.Name, err)
		return nil, err
	}

	return createdDeviceModel, nil
}

func UpdateDeviceModel(client kubeedgeClient.Interface, namespace string, deviceModel *devicev1beta1.DeviceModel) (*devicev1beta1.DeviceModel, error) {
	klog.V(4).Infof("Updating device model %s in namespace %s", deviceModel.Name, namespace)

	updatedDeviceModel, err := client.DevicesV1beta1().DeviceModels(namespace).Update(context.TODO(), deviceModel, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update device model %s: %v", deviceModel.Name, err)
		return nil, err
	}

	return updatedDeviceModel, nil
}

func DeleteDeviceModel(client kubeedgeClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting device model %s in namespace %s", name, namespace)

	err := client.DevicesV1beta1().DeviceModels(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete device model %s: %v", name, err)
		return err
	}

	return nil
}
