'use client'

import styles from "./page.module.css";
import { Grid } from '@mui/material';
import React, { useEffect } from 'react';
import { ProgressCard } from '@/component/ProgressCard';
import { StatusCard } from '@/component/StatusCard';
import { VersionCard } from '@/component/VersionCard';
import { PodsTable } from '@/component/PodTable';
import { useListPods } from "@/api/pod";
import { useNamespace } from "@/hook/useNamespace";
import { useGetK8sVersion } from "@/api/version";
import { Pod } from '@/types/pod';
import { Node } from '@/types/node';
import { getNodeStatus, getPodStatus } from "@/helper/status";
import { useListNodes } from "@/api/node";
import { Deployment } from "@/types/deployment";
import { useListDeployments } from "@/api/deployment";

const CardRow = (props: {
  k8sVersion?: string;
  nodes?: Node[];
  apps?: Deployment[];
}) => {
  let readyNodes = 0;
  let notReadyNodes = 0;
  let availableApps = 0;
  let unavailableApps = 0;

  props?.nodes?.forEach(node => {
    getNodeStatus(node) === 'Ready' ? readyNodes++ : notReadyNodes++;
  });
  props?.apps?.forEach(app => {
    availableApps += app.status?.availableReplicas || 0;
    unavailableApps += (app.status?.replicas || 0) - (app.status?.availableReplicas || 0);
  });

  const kubeedgeVersionParts = props?.nodes?.find(node => node?.status?.nodeInfo?.kubeletVersion.includes('kubeedge'))?.status?.nodeInfo?.kubeletVersion?.split('-');
  const kubeedgePartIndex = kubeedgeVersionParts?.findIndex(part => part === 'kubeedge') || -1;
  const kubeedgeVersion = kubeedgePartIndex >= 0 && kubeedgeVersionParts?.[kubeedgePartIndex + 1];

  const cardData = [
    {
      title: 'Node Status',
      statusData: [
        { label: 'Ready', value: `${readyNodes}`, color: 'green', dotColor: 'green' },
        { label: 'NotReady', value: `${notReadyNodes}`, color: 'orange', dotColor: 'red' },
      ],
    },
    {
      title: 'Deployment Status',
      statusData: [
        { label: 'Running', value: `${availableApps}`, color: 'green', dotColor: 'green' },
        { label: 'Disabled', value: `${unavailableApps}`, color: 'orange', dotColor: 'orange' },
      ],
    },
    {
      title: 'Version Information',
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
    { value: totalCpu === 0 ? 0 : Math.round(totalCpu / totalCpu * 1000) / 10, total: `Memory: ${totalCpu}m`, color: '#00e676' },
  ];

  const memoryData = [
    { value: totalMemory === 0 ? 0 : Math.round(availableMemory / totalMemory * 1000) / 10, total: `Memory: ${totalMemory}Mi`, color: '#00e676' },
  ];

  const podData = [
    { value: totalPods === 0 ? 0 : Math.round(runningPods / totalPods * 1000) / 10, total: `Pods: ${totalPods}`, color: '#00e676' },
  ];

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <ProgressCard title="CPU" progressData={cpuData} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ProgressCard title="Memory" progressData={memoryData} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ProgressCard title="Pod" progressData={podData} />
      </Grid>
    </Grid>
  );
};

export default function Home() {
  const { namespace } = useNamespace();
  const { data, mutate } = useListPods(namespace);
  const versionDate = useGetK8sVersion()?.data;
  const nodeData = useListNodes()?.data;
  const { data: appData, mutate: appMutate } = useListDeployments(namespace);

  useEffect(() => {
    mutate();
    appMutate();
  }, [namespace, mutate, appMutate]);

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

      <div className={styles.description}>
        <PodsTable data={data?.items} />
      </div>
    </div>
  );
}
