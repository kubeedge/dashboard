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

package common

import (
	"k8s.io/apimachinery/pkg/version"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/klog/v2"
)

func GetVersion(client k8sClient.Interface) (*version.Info, error) {
	klog.V(4).Info("Getting kubernetes version")

	version, err := client.Discovery().ServerVersion()
	if err != nil {
		klog.Errorf("Failed to get kubernetes version: %v", err)
		return nil, err
	}

	return version, nil
}
