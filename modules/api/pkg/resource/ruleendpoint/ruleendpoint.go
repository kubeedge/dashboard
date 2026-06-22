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

package ruleendpoint

import (
	"context"

	rulev1 "github.com/kubeedge/api/apis/rules/v1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetRuleEndpointList(client kubeedgeClient.Interface, namespace string) (*rulev1.RuleEndpointList, error) {
	klog.V(4).Info("Getting rule endpoint list")

	list, err := client.RulesV1().RuleEndpoints(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get rule endpoint list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetRuleEndpoint(client kubeedgeClient.Interface, namespace, name string) (*rulev1.RuleEndpoint, error) {
	klog.V(4).Infof("Getting rule endpoint %s in namespace %s", name, namespace)

	ruleEndpoint, err := client.RulesV1().RuleEndpoints(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get rule endpoint %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return ruleEndpoint, nil
}

func CreateRuleEndpoint(client kubeedgeClient.Interface, namespace string, ruleEndpoint *rulev1.RuleEndpoint) (*rulev1.RuleEndpoint, error) {
	klog.V(4).Infof("Creating rule endpoint %s in namespace %s", ruleEndpoint.Name, namespace)

	createdRuleEndpoint, err := client.RulesV1().RuleEndpoints(namespace).Create(context.TODO(), ruleEndpoint, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create rule endpoint %s in namespace %s: %v", ruleEndpoint.Name, namespace, err)
		return nil, err
	}

	return createdRuleEndpoint, nil
}

func UpdateRuleEndpoint(client kubeedgeClient.Interface, namespace string, ruleEndpoint *rulev1.RuleEndpoint) (*rulev1.RuleEndpoint, error) {
	klog.V(4).Infof("Updating rule endpoint %s in namespace %s", ruleEndpoint.Name, namespace)

	updatedRuleEndpoint, err := client.RulesV1().RuleEndpoints(namespace).Update(context.TODO(), ruleEndpoint, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update rule endpoint %s in namespace %s: %v", ruleEndpoint.Name, namespace, err)
		return nil, err
	}

	return updatedRuleEndpoint, nil
}

func DeleteRuleEndpoint(client kubeedgeClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting rule endpoint %s in namespace %s", name, namespace)

	err := client.RulesV1().RuleEndpoints(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete rule endpoint %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
