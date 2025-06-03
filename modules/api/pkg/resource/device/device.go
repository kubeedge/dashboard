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

package device

import (
	"context"

	devicev1beta1 "github.com/kubeedge/api/apis/devices/v1beta1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetDeviceList(client kubeedgeClient.Interface, namespace string) (*devicev1beta1.DeviceList, error) {
	klog.V(4).Infof("Getting device list")

	list, err := client.DevicesV1beta1().Devices(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get device list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetDevice(client kubeedgeClient.Interface, namespace, name string) (*devicev1beta1.Device, error) {
	klog.V(4).Infof("Getting device %s in namespace %s", name, namespace)

	device, err := client.DevicesV1beta1().Devices(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get device %s: %v", name, err)
		return nil, err
	}

	return device, nil
}

func CreateDevice(client kubeedgeClient.Interface, namespace string, device *devicev1beta1.Device) (*devicev1beta1.Device, error) {
	klog.V(4).Infof("Creating device %s in namespace %s", device.Name, namespace)

	createdDevice, err := client.DevicesV1beta1().Devices(namespace).Create(context.TODO(), device, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create device %s: %v", device.Name, err)
		return nil, err
	}

	return createdDevice, nil
}

func UpdateDevice(client kubeedgeClient.Interface, namespace string, device *devicev1beta1.Device) (*devicev1beta1.Device, error) {
	klog.V(4).Infof("Updating device %s in namespace %s", device.Name, namespace)

	updatedDevice, err := client.DevicesV1beta1().Devices(namespace).Update(context.TODO(), device, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update device %s: %v", device.Name, err)
		return nil, err
	}

	return updatedDevice, nil
}

func DeleteDevice(client kubeedgeClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting device %s in namespace %s", name, namespace)

	err := client.DevicesV1beta1().Devices(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete device %s: %v", name, err)
		return err
	}

	return nil
}
