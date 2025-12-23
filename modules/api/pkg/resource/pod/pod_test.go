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

package pod

import (
	"testing"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes/fake"
)

func TestGetPodList(t *testing.T) {
	// Prepare test data
	ns := "default"
	pod1 := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "pod-1",
			Namespace: ns,
		},
	}
	pod2 := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "pod-2",
			Namespace: ns,
		},
	}
	pod3 := &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "pod-3",
			Namespace: "other-ns",
		},
	}

	// Create a fake clientset with initial data
	client := fake.NewSimpleClientset(pod1, pod2, pod3)

	tests := []struct {
		name          string
		namespace     string
		expectedCount int
		expectedError bool
	}{
		{
			name:          "get pods from default namespace",
			namespace:     "default",
			expectedCount: 2,
			expectedError: false,
		},
		{
			name:          "get pods from other namespace",
			namespace:     "other-ns",
			expectedCount: 1,
			expectedError: false,
		},
		{
			name:          "get pods from non-existent namespace",
			namespace:     "non-existent",
			expectedCount: 0,
			expectedError: false,
		},
		{
			name:          "get all pods (all namespaces)",
			namespace:     "",
			expectedCount: 3,
			expectedError: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			list, err := GetPodList(client, tt.namespace)

			if (err != nil) != tt.expectedError {
				t.Errorf("GetPodList() error = %v, expectedError %v", err, tt.expectedError)
				return
			}

			if list == nil {
				if tt.expectedCount != 0 {
					t.Errorf("GetPodList() returned nil list, expected count %d", tt.expectedCount)
				}
				return
			}

			if len(list.Items) != tt.expectedCount {
				t.Errorf("GetPodList() returned %d pods, expected %d", len(list.Items), tt.expectedCount)
			}
		})
	}
}
