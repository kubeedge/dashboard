package kubeedge

import (
	"fmt"
	"go/build"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"k8s.io/klog/v2"
)

func commandExists(command string) (string, bool) {
	path, err := exec.LookPath(command)
	return path, err == nil
}

func isInContainer() bool {
	if _, err := os.Stat("/.dockerenv"); err == nil {
		klog.Info(".dockerenv file exists, indicating that the process is running in a Docker container")
		return true
	}

	if data, err := os.ReadFile("/proc/1/cgroup"); err == nil {
		text := string(data)
		if strings.Contains(text, "docker") || strings.Contains(text, "kubepods") ||
			strings.Contains(text, "containerd") {
			klog.Info("Cgroup file contains 'docker', 'kubepods', or 'containerd', indicating that the process is running in a container")
			return true
		}
	}

	klog.Info("No indication that the process is running in a Docker container")

	return false
}

func checkDependencies(hasKeink bool) error {
	var commands []string

	if hasKeink {
		commands = []string{"kubectl", "docker"}
	} else {
		commands = []string{"kubectl", "git", "make", "docker", "go"}
	}

	for _, cmd := range commands {
		if _, ok := commandExists(cmd); !ok {
			klog.Errorf("Command %s not found", cmd)
			return fmt.Errorf("command %s not found", cmd)
		}
	}
	klog.Info("All required commands are available")

	return nil
}

func getKeinkPath() (string, bool) {
	if path, ok := commandExists("keink"); ok {
		return path, true
	}

	binDir := filepath.Join(build.Default.GOPATH, "src", "github.com", "kubeedge", "keink", "bin", "keink")
	if _, err := os.Stat(binDir); err == nil {
		klog.Infof("Keink binary found at %s", binDir)
		return binDir, true
	}

	return "", false
}

func CheckIsAbleToRunKeink() bool {
	if isInContainer() {
		klog.Info("Running in a container, unable to run keink")
		return false
	}

	_, hasKeink := getKeinkPath()
	if err := checkDependencies(hasKeink); err != nil {
		return false
	}

	return true
}
