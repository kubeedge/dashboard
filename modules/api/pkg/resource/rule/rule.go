package rule

import (
	"context"

	rulev1 "github.com/kubeedge/api/apis/rules/v1"
	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetRuleList(client kubeedgeClient.Interface, namespace string) (*rulev1.RuleList, error) {
	klog.V(4).Infof("Getting rule list")

	list, err := client.RulesV1().Rules(namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get rule list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetRule(client kubeedgeClient.Interface, namespace, name string) (*rulev1.Rule, error) {
	klog.V(4).Infof("Getting rule %s in namespace %s", name, namespace)

	rule, err := client.RulesV1().Rules(namespace).Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get rule %s in namespace %s: %v", name, namespace, err)
		return nil, err
	}

	return rule, nil
}

func CreateRule(client kubeedgeClient.Interface, namespace string, rule *rulev1.Rule) (*rulev1.Rule, error) {
	klog.V(4).Infof("Creating rule %s in namespace %s", rule.Name, namespace)

	createdRule, err := client.RulesV1().Rules(namespace).Create(context.TODO(), rule, metav1.CreateOptions{})
	if err != nil {
		klog.Errorf("Failed to create rule %s in namespace %s: %v", rule.Name, namespace, err)
		return nil, err
	}

	return createdRule, nil
}

func UpdateRule(client kubeedgeClient.Interface, namespace string, rule *rulev1.Rule) (*rulev1.Rule, error) {
	klog.V(4).Infof("Updating rule %s in namespace %s", rule.Name, namespace)

	updatedRule, err := client.RulesV1().Rules(namespace).Update(context.TODO(), rule, metav1.UpdateOptions{})
	if err != nil {
		klog.Errorf("Failed to update rule %s in namespace %s: %v", rule.Name, namespace, err)
		return nil, err
	}

	return updatedRule, nil
}

func DeleteRule(client kubeedgeClient.Interface, namespace, name string) error {
	klog.V(4).Infof("Deleting rule %s in namespace %s", name, namespace)

	err := client.RulesV1().Rules(namespace).Delete(context.TODO(), name, metav1.DeleteOptions{})
	if err != nil {
		klog.Errorf("Failed to delete rule %s in namespace %s: %v", name, namespace, err)
		return err
	}

	return nil
}
