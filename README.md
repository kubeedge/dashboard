# KubeEdge Dashboard

## Introduction
KubeEdge dashboard provides a graphical user interface (GUI) for managing and monitoring your KubeEdge clusters. It allows users to manage edge applications running in the cluster and troubleshoot them.

This project is currently in development, and we will iterate it continuously. We welcome any feedback and contributions.

## Contact
If you have any questions, feel free to reach out to us in the following ways:
* [Slack #dashboard](https://join.slack.com/t/kubeedge/shared_invite/enQtNjc0MTg2NTg2MTk0LWJmOTBmOGRkZWNhMTVkNGU1ZjkwNDY4MTY4YTAwNDAyMjRkMjdlMjIzYmMxODY1NGZjYzc4MWM5YmIxZjU1ZDI)
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
npm run dev --apiserver={proxy address}
Example: npm run dev --apiserver=https://192.168.33.129:6443
```
or

```bash with yarn
yarn dev --apiserver={proxy address}
Example: yarn dev --apiserver=https://192.168.33.129:6443
```
or

```bash with pnpm
pnpm dev --apiserver={proxy address}
Example: pnpm dev --apiserver=https://192.168.33.129:6443
```

### Login with token
```bash
kubectl create serviceaccount curl-user -n kube-system
kubectl create clusterrolebinding curl-user-binding --clusterrole=cluster-admin --serviceaccount=kube-system:curl-user -n kube-system
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep curl-user | awk '{print $1}')
```

## Contributing
If you're interested in being a contributor and want to get involved in developing the KubeEdge code, please see [CONTRIBUTING](./CONTRIBUTING.md) for details on submitting patches and the contribution workflow.

## License
KubeEdge is under Apache 2.0 license. See the [LICENSE](LICENSE) file for details.