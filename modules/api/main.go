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

package main

import (
	"net/http"

	"k8s.io/klog/v2"

	"github.com/kubeedge/dashboard/api/pkg/args"
	"github.com/kubeedge/dashboard/api/pkg/handler"
	"github.com/kubeedge/dashboard/client"
)

func main() {
	klog.InfoS("Starting KubeEdge Dashboard API")

	client.Init(
		client.WithAPIServer(args.APIServerHost()),
		client.WithInsecure(args.APIServerSkipTLSVerify()),
		client.WithKubeConfigPath(args.KubeConfigFile()),
	)

	apiHandler, err := handler.CreateHTTPAPIHandler()
	if err != nil {
		klog.ErrorS(err, "Failed to create API handler")
		return
	}

	keinkHandler, err := handler.CreateKeinkAPIHandler()
	if err != nil {
		klog.ErrorS(err, "Failed to create Keink API handler")
		return
	}

	http.Handle("/", apiHandler)
	http.Handle("/keink/", keinkHandler)

	serve()

	select {}
}

func serve() {
	addr := args.InsecureAddress()
	klog.Infof("Listening and serving HTTP on %s", addr)
	go func() {
		klog.Fatal(http.ListenAndServe(addr, nil))
	}()
}
