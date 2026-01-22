# syntax=docker/dockerfile:1

# ---------- builder ----------
FROM golang:1.23 as builder

ARG TARGETOS=linux
ARG TARGETARCH=amd64
WORKDIR /workspace

# Copy only what we need for go work based build
# Build assumes docker build context is the repository root.
COPY modules/ ./modules/

WORKDIR /workspace/modules/api

# Speed up builds and produce a small static binary
ENV CGO_ENABLED=0

# Download dependencies (layered cache)
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go mod download

# Build the binary
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /out/dashboard-api .

# ---------- runtime ----------
# Use distroless base to include CA certificates for TLS when talking to apiserver
FROM gcr.io/distroless/base-debian12:nonroot

ARG VCS_REF=""
ARG VERSION=""
ARG BUILD_DATE=""

LABEL org.opencontainers.image.title="KubeEdge Dashboard API" \
      org.opencontainers.image.description="Backend-for-frontend (BFF) API layer for the KubeEdge Dashboard" \
      org.opencontainers.image.source="https://github.com/kubeedge/dashboard" \
      org.opencontainers.image.revision="$VCS_REF" \
      org.opencontainers.image.version="$VERSION" \
      org.opencontainers.image.created="$BUILD_DATE"

WORKDIR /app

COPY --from=builder /out/dashboard-api /usr/local/bin/dashboard-api

EXPOSE 8080

USER nonroot:nonroot

# Defaults bind to all interfaces inside container
ENTRYPOINT ["/usr/local/bin/dashboard-api"]
CMD ["--insecure-bind-address=0.0.0.0", "--insecure-port=8080"]
