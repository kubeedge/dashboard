package main

import (
	"net/http"

	"github.com/kubeedge/dashboard/api/pkg/args"
	"github.com/kubeedge/dashboard/api/pkg/handler"
	"github.com/kubeedge/dashboard/client"
	"k8s.io/klog/v2"
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
