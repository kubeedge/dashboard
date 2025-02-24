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

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## Start project

### Linux/macOS

```bash
# Using npm
npm run build
API_SERVER={proxy address} npm run start
Example: API_SERVER=https://192.168.33.129:6443 npm run dev

# Using yarn
yarn build
API_SERVER={proxy address} yarn start
Example: API_SERVER=https://192.168.33.129:6443 yarn dev

# Using pnpm
pnpm run build
API_SERVER={proxy address} pnpm run start
Example: API_SERVER=https://192.168.33.129:6443 pnpm run dev
```

### Windows

For Windows users, use the following commands in **Command Prompt (cmd)** or **PowerShell**:

```powershell
# Using npm (Command Prompt or PowerShell)
npm run build
$env:API_SERVER="https://192.168.33.129:6443"; npm run start

# Using yarn (PowerShell)
yarn build
$env:API_SERVER="https://192.168.33.129:6443"; yarn start

# Using pnpm (PowerShell)
pnpm run build
$env:API_SERVER="https://192.168.33.129:6443"; pnpm run start
```

If your API server is running with a self-signed certificate, you can set `NODE_TLS_REJECT_UNAUTHORIZED=0` to ignore certificate verification:

```powershell
# Disable TLS verification (PowerShell)
$env:NODE_TLS_REJECT_UNAUTHORIZED=0
$env:API_SERVER="https://192.168.33.129:6443"
npm run dev
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

