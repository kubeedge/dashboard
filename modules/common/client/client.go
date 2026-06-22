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

package client

import (
	"net/http"
	"strings"

	kubeedgeClient "github.com/kubeedge/api/client/clientset/versioned"
	apiextensionsclientset "k8s.io/apiextensions-apiserver/pkg/client/clientset/clientset"
	"k8s.io/apimachinery/pkg/api/errors"
	k8sClient "k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
	"k8s.io/klog/v2"
)

func Client(request *http.Request) (k8sClient.Interface, error) {
	config, err := configFromRequest(request)
	if err != nil {
		klog.Errorf("Failed to create config from request: %v", err)
		return nil, err
	}

	klog.V(4).Infof("Creating Kubernetes client with config: %v", config)

	return k8sClient.NewForConfig(config)
}

func APIExtensionClient(request *http.Request) (apiextensionsclientset.Interface, error) {
	config, err := configFromRequest(request)
	if err != nil {
		klog.Errorf("Failed to create config from request: %v", err)
		return nil, err
	}

	klog.V(4).Infof("Creating API extension client with config: %v", config)

	return apiextensionsclientset.NewForConfig(config)
}

func KubeEdgeClient(request *http.Request) (kubeedgeClient.Interface, error) {
	config, err := configFromRequest(request)
	if err != nil {
		klog.Errorf("Failed to create config from request: %v", err)
		return nil, err
	}

	klog.V(4).Infof("Creating KubeEdge client with config: %v", config)

	return kubeedgeClient.NewForConfig(config)
}

func configFromRequest(request *http.Request) (*rest.Config, error) {
	authInfo, err := buildAuthInfo(request)
	if err != nil {
		return nil, err
	}

	return buildConfigFromAuthInfo(authInfo)
}

func buildConfigFromAuthInfo(authInfo *api.AuthInfo) (*rest.Config, error) {
	cmdCfg := api.NewConfig()

	cmdCfg.Clusters["kubernetes"] = &api.Cluster{
		Server:                   baseConfig.Host,
		CertificateAuthority:     baseConfig.TLSClientConfig.CAFile,
		CertificateAuthorityData: baseConfig.TLSClientConfig.CAData,
		InsecureSkipTLSVerify:    baseConfig.TLSClientConfig.Insecure,
	}

	cmdCfg.AuthInfos["kubernetes"] = authInfo

	cmdCfg.Contexts["kubernetes"] = &api.Context{
		Cluster:  "kubernetes",
		AuthInfo: "kubernetes",
	}
	cmdCfg.CurrentContext = "kubernetes"

	return clientcmd.NewDefaultClientConfig(
		*cmdCfg,
		&clientcmd.ConfigOverrides{},
	).ClientConfig()
}

func buildAuthInfo(request *http.Request) (*api.AuthInfo, error) {
	token := strings.TrimPrefix(request.Header.Get("Authorization"), "Bearer ")
	if token == "" {
		return nil, errors.NewUnauthorized("Unauthorized")
	}

	authInfo := &api.AuthInfo{
		Token: token,
	}

	return authInfo, nil
}
