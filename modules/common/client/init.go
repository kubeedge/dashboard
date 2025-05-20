package client

import (
	"os"

	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/klog/v2"
)

var (
	baseConfig *rest.Config
)

type Option func(*configBuilder)

type configBuilder struct {
	apiServer      string
	cartFile       string
	keyFile        string
	kubeConfigPath string
	insecure       bool
}

func newConfigBuilder(opts ...Option) *configBuilder {
	builder := new(configBuilder)

	for _, opt := range opts {
		opt(builder)
	}

	return builder
}

func (c *configBuilder) buildConfig() (*rest.Config, error) {
	if c.apiServer == "" && c.kubeConfigPath == "" {
		klog.Info("Using in-cluster config")
		config, err := rest.InClusterConfig()
		if err != nil {
			return nil, err
		}
		return config, nil
	}

	if len(c.kubeConfigPath) > 0 {
		klog.InfoS("Using kubeconfig file", "kubeconfig", c.kubeConfigPath)
	}

	if len(c.apiServer) > 0 {
		klog.InfoS("Using API server", "apiServer", c.apiServer)
	}

	config, err := clientcmd.BuildConfigFromFlags(c.apiServer, c.kubeConfigPath)
	if err != nil {
		klog.Errorf("Failed to build config from flags: %v", err)
		return nil, err
	}

	config.TLSClientConfig.Insecure = c.insecure

	return config, nil
}

func WithAPIServer(apiServer string) Option {
	return func(c *configBuilder) {
		c.apiServer = apiServer
	}
}

func WithInsecure(insecure bool) Option {
	return func(c *configBuilder) {
		c.insecure = insecure
	}
}

func WithKubeConfigPath(kubeConfigPath string) Option {
	return func(c *configBuilder) {
		c.kubeConfigPath = kubeConfigPath
	}
}

func Init(opts ...Option) {
	builder := newConfigBuilder(opts...)
	config, err := builder.buildConfig()
	if err != nil {
		klog.Errorf("Failed to build config: %v", err)
		os.Exit(1)
	}

	baseConfig = config
}
