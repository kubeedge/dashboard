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

package kubeedge

import (
	"bufio"
	"fmt"
	"go/build"
	"os"
	"os/exec"
	"path/filepath"

	"golang.org/x/tools/go/packages"
	"k8s.io/klog/v2"
)

func executeCommand(ch chan string, command string, args ...string) error {
	cmd := exec.Command(command, args...)

	errPipe, err := cmd.StderrPipe()
	if err != nil {
		klog.Errorf("Failed to get stderr pipe: %v", err)
		return err
	}
	outPipe, err := cmd.StdoutPipe()
	if err != nil {
		klog.Errorf("Failed to get stdout pipe: %v", err)
		return err
	}

	if err := cmd.Start(); err != nil {
		klog.Errorf("Failed to start command: %v", err)
		return err
	}

	go func() {
		scanner := bufio.NewScanner(errPipe)
		for scanner.Scan() {
			ch <- scanner.Text()
		}
	}()
	go func() {
		scanner := bufio.NewScanner(outPipe)
		for scanner.Scan() {
			ch <- scanner.Text()
		}
	}()

	if err := cmd.Wait(); err != nil {
		klog.Errorf("Command execution failed: %v", err)
		return err
	}

	return nil
}

func findOrCloneKeink(ch chan string) error {
	localDir := filepath.Join(build.Default.GOPATH, "src", "github.com", "kubeedge", "keink")
	if _, err := os.Stat(localDir); err == nil {
		klog.Infof("Loading keink package from %s", localDir)
		ch <- fmt.Sprintf("Loading keink package from %s", localDir)
		pkg, err := packages.Load(&packages.Config{Mode: packages.NeedName | packages.NeedFiles}, localDir)

		if err != nil {
			klog.Errorf("Failed to load keink package: %v", err)
			return fmt.Errorf("failed to load keink package: %v", err)
		} else if len(pkg) > 0 && pkg[0].PkgPath != "" {
			klog.Infof("Found keink package at %s", pkg[0].PkgPath)
			return nil
		}
	}

	klog.Infof("Cloning keink repository to %s", localDir)
	if err := executeCommand(ch, "git", "clone", "https://github.com/kubeedge/keink.git",
		"--depth=1", localDir); err != nil {
		klog.Errorf("Failed to clone keink repository: %v", err)
		return fmt.Errorf("failed to clone keink repository: %v", err)
	}
	klog.Infof("Cloned keink repository to %s", localDir)

	return nil
}

func installGoDependencies(ch chan string) error {
	klog.Info("Installing Go dependencies...")

	if err := executeCommand(ch, "go", "mod", "tidy"); err != nil {
		return fmt.Errorf("failed to install Go dependencies: %v", err)
	}
	klog.Info("Successfully installed Go dependencies")
	return nil
}

func makeKeink(ch chan string) error {
	klog.Info("Building keink...")

	if err := executeCommand(ch, "make"); err != nil {
		return fmt.Errorf("failed to run make: %v", err)
	}
	klog.Info("Successfully built keink")

	return nil
}

func buildKeink(ch chan string) error {
	if err := findOrCloneKeink(ch); err != nil {
		return err
	}

	cwd := os.Getenv("PWD")
	defer os.Chdir(cwd)

	destDir := filepath.Join(build.Default.GOPATH, "src", "github.com", "kubeedge", "keink")
	if err := os.Chdir(destDir); err != nil {
		klog.Errorf("Failed to change directory to keink: %v", err)
		return fmt.Errorf("failed to change directory to keink: %v", err)
	}

	if err := installGoDependencies(ch); err != nil {
		return err
	}

	if err := makeKeink(ch); err != nil {
		return err
	}

	return nil
}

func buildEdgeImage(ch chan string, keinkPath string) error {
	// Check image existence
	if err := executeCommand(ch, "docker", "inspect", "kubeedge/node:latest"); err == nil {
		klog.Info("Image kubeedge/node:latest already exists, skipping build")
		return nil
	}

	klog.Info("Building edge image...")

	if err := executeCommand(ch, keinkPath, "build", "edge-image"); err != nil {
		return fmt.Errorf("failed to build edge image: %v", err)
	}
	klog.Info("Successfully built edge image")
	return nil
}

func runKubeEdge(ch chan string, keinkPath string) error {
	klog.Info("Running kubeedge...")

	if err := executeCommand(ch, keinkPath, "create", "kubeedge", "--image",
		"kubeedge/node:latest", "--wait", "120s"); err != nil {
		return fmt.Errorf("failed to run kubeedge: %v", err)
	}
	klog.Info("Successfully created kubeedge")
	return nil
}

func runKeink(ch chan string, keinkPath string) error {
	if err := buildEdgeImage(ch, keinkPath); err != nil {
		return err
	}

	if err := runKubeEdge(ch, keinkPath); err != nil {
		return err
	}

	return nil
}

func RunKubeEdgeByKeink() (chan string, chan error, error) {
	isAbleToRun := CheckIsAbleToRunKeink()
	if !isAbleToRun {
		return nil, nil, fmt.Errorf("unable to run Keink to create kubeedge")
	}

	keinkPath, hasKeink := getKeinkPath()

	if err := checkDependencies(hasKeink); err != nil {
		return nil, nil, err
	}

	ch := make(chan string)
	errChan := make(chan error)
	go func() {
		defer close(ch)
		defer func() {
			errChan <- nil
			close(errChan)
		}()

		if !hasKeink {
			if err := buildKeink(ch); err != nil {
				errChan <- err
				return
			}

			keinkPath = filepath.Join(build.Default.GOPATH, "src", "github.com", "kubeedge", "keink", "bin", "keink")
		}

		if err := runKeink(ch, keinkPath); err != nil {
			errChan <- err
			return
		}
	}()

	return ch, errChan, nil
}
