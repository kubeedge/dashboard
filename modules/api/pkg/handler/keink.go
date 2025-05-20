package handler

import (
	"fmt"

	"github.com/emicklei/go-restful/v3"
	"github.com/kubeedge/dashboard/api/pkg/kubeedge"
	"github.com/kubeedge/dashboard/errors"
	"k8s.io/klog/v2"
)

func (apiHandler *APIHandler) runKubeEdgeByKeink(request *restful.Request, response *restful.Response) {
	klog.Info("run kubeedge by keink")

	outputCh, errCh, err := kubeedge.RunKubeEdgeByKeink()
	if err != nil {
		errors.HandleInternalError(response, err)
		return
	}

	// Set SSE headers
	response.Header().Set("Access-Control-Allow-Origin", "*")
	response.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	response.Header().Set("Content-Type", "text/event-stream")
	response.Header().Set("Cache-Control", "no-cache")

	writer := response.ResponseWriter

	for {
		select {
		case output := <-outputCh:
			if output != "" {
				fmt.Fprintf(writer, "data: %s\n\n", output)
				response.Flush()
			}
		case err := <-errCh:
			if err != nil {
				writer.Write([]byte("event error\ndata: " + err.Error() + " \n\n"))
			} else {
				writer.Write([]byte("data: KubeEdge installation completed successfully\n\n"))
			}

			writer.Write([]byte("event: done\ndata: \n\n"))
			response.Flush()
			return
		}
	}
}

func (apiHandler *APIHandler) checkIsAbleToRunKeink(request *restful.Request, response *restful.Response) {
	ok := kubeedge.CheckIsAbleToRunKeink()
	response.WriteAsJson(map[string]bool{"ok": ok})
}
