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

package handler

import (
	"fmt"

	"github.com/emicklei/go-restful/v3"
	"k8s.io/klog/v2"

	"github.com/kubeedge/dashboard/api/pkg/kubeedge"
	"github.com/kubeedge/dashboard/errors"
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
