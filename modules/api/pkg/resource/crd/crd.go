package crd

import (
	"context"

	apiextensionsv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	apiextensionsclientset "k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/klog/v2"
)

func GetCRDList(client apiextensionsclientset.Interface) (*apiextensionsv1.CustomResourceDefinitionList, error) {
	klog.V(4).Infof("Getting CRD list")

	list, err := client.ApiextensionsV1().CustomResourceDefinitions().List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		klog.Errorf("Failed to get CRD list: %v", err)
		return nil, err
	}

	return list, nil
}

func GetCRD(client apiextensionsclientset.Interface, name string) (*apiextensionsv1.CustomResourceDefinition, error) {
	klog.V(4).Infof("Getting CRD %s", name)

	result, err := client.ApiextensionsV1().CustomResourceDefinitions().Get(context.TODO(), name, metav1.GetOptions{})
	if err != nil {
		klog.Errorf("Failed to get CRD %s: %v", name, err)
		return nil, err
	}

	return result, nil
}
