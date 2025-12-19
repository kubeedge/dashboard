'use client'

import styles from "./page.module.css";
import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { ProgressCard } from '@/component/Common/ProgressCard';
import { StatusCard } from '@/component/Common/StatusCard';
import { VersionCard } from '@/component/Common/VersionCard';
import { useListPods } from "@/api/pod";
import { useNamespace } from "@/hook/useNamespace";
import { useGetK8sVersion } from "@/api/version";
import { Pod } from '@/types/pod';
import { ConciseNode } from '@/types/node';
import { getPodStatus } from "@/helper/status";
import { useListNodes } from "@/api/node";
import { ConciseDeployment } from "@/types/deployment";
import { useListDeployments } from "@/api/deployment";
import { useI18n } from "@/hook/useI18n";

const CardRow = (props: {
  k8sVersion?: string;
  nodes?: ConciseNode[];
  apps?: ConciseDeployment[];
}) => {
  const { t } = useI18n();
  let readyNodes = 0;
  let notReadyNodes = 0;
  let availableApps = 0;
  let unavailableApps = 0;

  props?.nodes?.forEach(node => {
    node.status === 'Ready' ? readyNodes++ : notReadyNodes++;
  });
  props?.apps?.forEach(app => {
    availableApps += app?.availableReplicas || 0;
    unavailableApps += (app?.replicas || 0) - (app?.availableReplicas || 0);
  });

  const extractKubeEdgeVersion = (nodes?: ConciseNode[]) => {
    if (!nodes || nodes.length === 0) return undefined;
    // Regex: match 'kubeedge' followed by optional separators and an optional 'v', then capture version like 1.13.1
    const re = /kubeedge[^0-9a-zA-Z]*v?([0-9]+(?:\.[0-9]+){1,3})/i;
    for (const node of nodes) {
      if (node.kubeletVersion) {
        const m = node.kubeletVersion.match(re);
        if (m && m[1]) {
          const v = m[1];
          return v.startsWith('v') ? v : `v${v}`;
        }
      }
    }
    return undefined;
  };

  const kubeedgeVersion = extractKubeEdgeVersion(props?.nodes);

  const cardData = [
    {
      title: t('dashboard.nodeStatus'),
      statusData: [
        { label: t('status.ready'), value: `${readyNodes}`, color: 'green', dotColor: 'green' },
        { label: t('status.notReady'), value: `${notReadyNodes}`, color: 'orange', dotColor: 'red' },
      ],
    },
    {
      title: t('dashboard.deploymentStatus'),
      statusData: [
        { label: t('status.running'), value: `${availableApps}`, color: 'green', dotColor: 'green' },
        { label: t('status.inactive'), value: `${unavailableApps}`, color: 'orange', dotColor: 'orange' },
      ],
    },
    {
      title: t('dashboard.versionInfo'),
      statusData: [
        { label: 'Kubernetes', value: props?.k8sVersion || '', color: 'black', dotColor: 'transparent' },
        { label: 'KubeEdge', value: kubeedgeVersion || '', color: 'black', dotColor: 'transparent' },
      ],
    },
  ];

  return (
    <Grid container spacing={3}>
      {cardData.map((card, index) => (
        <Grid item xs={4} key={index}>
          {index === 2 ? <VersionCard title={card.title} statusData={card.statusData} /> : <StatusCard title={card.title} statusData={card.statusData} />}
        </Grid>
      ))}
    </Grid>
  );
};

const DashboardCir = (props: {
  pods?: Pod[];
}) => {
  const { t } = useI18n();
  const totalPods = props?.pods?.length || 0;
  let runningPods = 0;
  let totalCpu = 0;
  let totalMemory = 0;
  let availableCpu = 0;
  let availableMemory = 0;

  props?.pods?.forEach(pod => {
    const status = getPodStatus(pod);
    const cpu = pod.spec?.containers?.reduce((prev, cur) => prev + (parseFloat(cur.resources?.requests?.cpu || '') || 0), 0) || 0;
    const memory = pod.spec?.containers?.reduce((prev, cur) => prev + (parseFloat(cur.resources?.requests?.memory || '') || 0), 0) || 0;
    if (status === 'Ready') {
      runningPods++
      availableCpu += cpu;
      availableMemory += memory;
    }
    totalCpu += cpu;
    totalMemory += memory;
  })

  const cpuData = [
    { value: totalCpu === 0 ? 0 : Math.round(totalCpu / totalCpu * 1000) / 10, total: `CPU: ${totalCpu}m`, color: '#00e676' },
  ];

  const memoryData = [
    { value: totalMemory === 0 ? 0 : Math.round(availableMemory / totalMemory * 1000) / 10, total: `${t('dashboard.memory')}: ${totalMemory}Mi`, color: '#00e676' },
  ];

  const podData = [
    { value: totalPods === 0 ? 0 : Math.round(runningPods / totalPods * 1000) / 10, total: `${t('dashboard.pods')}: ${totalPods}`, color: '#00e676' },
  ];

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={12} md={12}>
        <ProgressCard title={t('dashboard.cpu')} progressData={cpuData} />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <ProgressCard title={t('dashboard.memory')} progressData={memoryData} />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <ProgressCard title={t('dashboard.pod')} progressData={podData} />
      </Grid>
    </Grid>
  );
};

export default function Home() {
  const { namespace } = useNamespace();
  const { data } = useListPods(namespace);
  const versionDate = useGetK8sVersion()?.data;
  const nodeData = useListNodes()?.data;
  const appData = useListDeployments(namespace)?.data;

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <CardRow
          k8sVersion={versionDate?.gitVersion}
          nodes={nodeData?.items}
          apps={appData?.items}
        />
      </div>

      <div className={styles.description}>
        <DashboardCir
          pods={data?.items}
        />
      </div>
    </div>
  );
}
