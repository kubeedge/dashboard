# KubeEdge Dashboard

## Introduction
KubeEdge dashboard provides a graphical user interface (GUI) for managing and monitoring your KubeEdge clusters. It allows users to manage edge applications running in the cluster and troubleshoot them.

This project is currently in development, and we will iterate it continuously. We welcome any feedback and contributions.

## Contact
If you have any questions, feel free to reach out to us in the following ways:
* [Slack #dashboard](https://kubeedge.io/docs/community/slack/)

## Prepare environment

The KubeEdge dashboard consists of two modules: API (backend-for-frontend) and Web (frontend). The API provides endpoints consumed by the Web app.

- **API**: Go toolchain if running locally without Docker
- **Web**: Node.js 18+ and a package manager (npm/yarn/pnpm)

## Install packages (local dev)

### API

```bash
cd modules
go work use ./api ./common/client ./common/errors
cd api
go mod download
```

### Web

Use your preferred package manager:

```bash
cd modules/web
npm install  # or: yarn install / pnpm install
```

## Run locally (without Docker)

### API

```bash
cd modules/api
# Example: connect to a remote API server
go run main.go --apiserver-host=https://192.168.33.129:6443
# Add this if using a self-signed certificate:
#   --apiserver-skip-tls-verify=true
# Bind/port flags (defaults):
#   --insecure-bind-address=127.0.0.1 --insecure-port=8080
```

### Web

```bash
cd modules/web
npm run build
API_SERVER={api_base_url} npm run start
# Example for local API:
#   API_SERVER=http://127.0.0.1:8080 npm run dev
```

## Run with Docker

### Build images

```bash
# from repo root
# API image
docker build -f modules/api/Dockerfile -t kubeedge-dashboard-api:local .

# Web image
docker build -f modules/web/Dockerfile -t kubeedge-dashboard-web:local modules/web
```

### Run containers

```bash
# 1) Run API (choose ONE of the following connection methods)
# a) In-cluster auth (run this in Kubernetes instead of locally)
#    No extra flags needed; container will use in-cluster config
# b) Remote API server endpoint
API_HOST=https://<k8s-api-host:port>
API_INSECURE=false   # set to true for self-signed clusters

docker run --rm -p 8080:8080 \
  --name kubeedge-dashboard-api \
  kubeedge-dashboard-api:local \
  --insecure-bind-address=0.0.0.0 --insecure-port=8080 \
  --apiserver-host="${API_HOST}" \
  $( [ "$API_INSECURE" = "true" ] && echo --apiserver-skip-tls-verify=true )

# Alternatively, mount a kubeconfig from the host
# docker run --rm -p 8080:8080 \
#   -v $HOME/.kube/config:/kubeconfig:ro \
#   kubeedge-dashboard-api:local \
#   --insecure-bind-address=0.0.0.0 --insecure-port=8080 \
#   --kubeconfig=/kubeconfig

# 2) Run Web and point it to the API container
docker run --rm -p 3000:3000 \
  -e API_SERVER=http://host.docker.internal:8080 \ 
  --name kubeedge-dashboard-web \
  kubeedge-dashboard-web:local
```

Notes:
- The Web container expects `API_SERVER` to be reachable from inside the container. On macOS/Windows Docker Desktop, `host.docker.internal` resolves the host; on Linux, use the host IP or user-defined bridge networking.
- API listens on 8080 inside the container by default and exposes `/api/v1/*` and `/keink/*` via the Web proxy.

### Login with token

```bash
kubectl create serviceaccount curl-user -n kube-system
kubectl create clusterrolebinding curl-user-binding --clusterrole=cluster-admin --serviceaccount=kube-system:curl-user -n kube-system

# For Kubernetes 1.23 and earlier:
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep curl-user | awk '{print $1}')
# For Kubernetes 1.24 and later:
kubectl create token curl-user -n kube-system
```

## Contributing
If you're interested in being a contributor and want to get involved in developing the KubeEdge code, please see [CONTRIBUTING](./CONTRIBUTING.md) for details on submitting patches and the contribution workflow.

## License
KubeEdge is under Apache 2.0 license. See the [LICENSE](LICENSE) file for details.
