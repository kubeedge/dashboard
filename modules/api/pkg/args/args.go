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

package args

import (
	"flag"
	"net"
	"strconv"

	"github.com/spf13/pflag"
	"k8s.io/klog/v2"
)

const (
	defaultInsecurePort = 8080
	defaultPort         = 8443
)

var (
	argApiServerSkipTLSVerify = pflag.Bool("apiserver-skip-tls-verify", false, "enable if connection with remote Kubernetes API server should skip TLS verify")
	argApiServerHost          = pflag.String("apiserver-host", "", "address of the Kubernetes API server to connect to in the format of protocol://address:port, leave it empty if the binary runs inside cluster for local discovery attempt")
	argKubeConfigFile         = pflag.String("kubeconfig", "", "path to kubeconfig file with control plane location information")

	argInsecurePort        = pflag.Int("insecure-port", defaultInsecurePort, "port to listen to for incoming HTTP requests")
	argInsecureBindAddress = pflag.IP("insecure-bind-address", net.IPv4(127, 0, 0, 1), "IP address on which to serve the --insecure-port, set to 0.0.0.0 for all interfaces")
)

func init() {
	// Init klog
	fs := flag.NewFlagSet("", flag.PanicOnError)
	klog.InitFlags(fs)

	// Default log level to 1
	_ = fs.Set("v", "1")

	pflag.CommandLine.AddGoFlagSet(fs)
	pflag.Parse()
}

func APIServerHost() string {
	return *argApiServerHost
}

func APIServerSkipTLSVerify() bool {
	return *argApiServerSkipTLSVerify
}

func KubeConfigFile() string {
	return *argKubeConfigFile
}

func InsecureAddress() string {
	return net.JoinHostPort(argInsecureBindAddress.String(), strconv.Itoa(*argInsecurePort))
}
