package args

import (
	"net"
	"strconv"

	"github.com/spf13/pflag"
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
