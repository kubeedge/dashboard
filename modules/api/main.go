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
	)

	apiHandler, err := handler.CreateHTTPAPIHandler()
	if err != nil {
		klog.ErrorS(err, "Failed to create API handler")
		return
	}

	http.Handle("/", apiHandler)

	klog.InfoS("Listening and serving HTTP on :8080") // TODO
	go func() {
		http.ListenAndServe(":8080", nil)
	}()

	select {}
}
