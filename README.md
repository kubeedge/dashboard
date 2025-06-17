# KubeEdge Dashboard

## Introduction
KubeEdge dashboard provides a graphical user interface (GUI) for managing and monitoring your KubeEdge clusters. It allows users to manage edge applications running in the cluster and troubleshoot them.

This project is currently in development, and we will iterate it continuously. We welcome any feedback and contributions.

## Contact
If you have any questions, feel free to reach out to us in the following ways:
* [Slack #dashboard](https://kubeedge.io/docs/community/slack/)

## Prepare environment

The KubeEdge dashboard consists of two modules: backend and frontend. The backend module is responsible for providing APIs to the frontend, while the frontend module is responsible for rendering the user interface.

For backend module, golang is needed.

For frontend module, nodejs, npm/yarn/pnpm is needed, pnpm is recommended.

## Install packages

### Backend

To install the backend dependencies, you need to have Go installed. You can use the following command to install the dependencies:

```bash
cd module
go mod download
```

### Frontend

To install the frontend dependencies, you can use npm, yarn, or pnpm. Choose one of the following commands based on your preference:

```bash with npm
npm install
```

```bash with yarn
yarn install
```

or

```bash with pnpm
pnpm install
```

### Start project

### Backend

You can start the backend server by running the following command:

```bash
cd module/api
go run main.go --apiserver-host=https://192.168.33.129:6443
```

If your API server is running with self-signed certificate, you can set `--apiserver-skip-tls-verify true` option to ignore the certificate verification.

### Frontend

```bash with npm
npm run build
API_SERVER={api module address} npm run start
Example: API_SERVER=http://127.0.0.1:8080 npm run dev
```
or

```bash with yarn
yarn build
API_SERVER={api module address} yarn start
Example: API_SERVER=http://127.0.0.1:8080 yarn dev
```
or

```bash with pnpm
pnpm run build
API_SERVER={api module address} pnpm run start
Example: API_SERVER=http://127.0.0.1:8080 pnpm run dev
```

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
