# KubeEdge Dashboard

## Introduction
KubeEdge dashboard provides a graphical user interface (GUI) for managing and monitoring your KubeEdge clusters. It allows users to manage edge applications running in the cluster and troubleshoot them.

This project is currently in development, and we will iterate it continuously. We welcome any feedback and contributions.

## Contact
If you have any questions, feel free to reach out to us in the following ways:
* [Slack #dashboard](https://kubeedge.io/docs/community/slack/)

## Prepare environment
nodejs, npm/yarn/pnpm is needed, pnpm is recommended

## Install packages

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

```bash with npm
npm run build
API_SERVER={proxy address} npm run start
Example: API_SERVER=https://192.168.33.129:6443 npm run dev
```
or

```bash with yarn
yarn build
API_SERVER={proxy address} yarn start
Example: API_SERVER=https://192.168.33.129:6443 yarn dev
```
or

```bash with pnpm
pnpm run build
API_SERVER={proxy address} pnpm run start
Example: API_SERVER=https://192.168.33.129:6443 pnpm run dev
```

If your API server is running with self-signed certificate, you can set `NODE_TLS_REJECT_UNAUTHORIZED=0` to ignore the certificate verification.

```bash with npm
NODE_TLS_REJECT_UNAUTHORIZED=0 API_SERVER=https://192.168.33.129:6443 npm run dev
```

If you need to build the image locally for testing, you can refer to the following example.

```bash with npm
docker build -t kubeedge-dashboard .
docker run -p 3000:3000 -e API_SERVER=https://192.168.33.129:6443 kubeedge-dashboard
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
