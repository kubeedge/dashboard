package args

import (
	"github.com/spf13/pflag"
)

var (
	argApiServerSkipTLSVerify = pflag.Bool("apiserver-skip-tls-verify", false, "enable if connection with remote Kubernetes API server should skip TLS verify")
	argApiServerHost          = pflag.String("apiserver-host", "", "address of the Kubernetes API server to connect to in the format of protocol://address:port, leave it empty if the binary runs inside cluster for local discovery attempt")
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
