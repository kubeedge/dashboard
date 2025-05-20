package errors

import (
	"net/http"

	"github.com/emicklei/go-restful/v3"
	k8serrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

func HandleError(err error) (int, error) {
	if k8serrors.IsUnauthorized(err) {
		return http.StatusUnauthorized, k8serrors.NewUnauthorized("Unauthorized")
	}

	if k8serrors.IsForbidden(err) {
		return http.StatusForbidden, k8serrors.NewForbidden(schema.GroupResource{}, "Forbidden", err)
	}

	return http.StatusInternalServerError, err
}

func HandleInternalError(response *restful.Response, err error) {
	code, err := HandleError(err)

	response.AddHeader("Content-Type", "plain/text")
	_ = response.WriteError(code, err)
}
