import { useState } from "react"
import { Box, Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography, Card, CardHeader, CardContent, Select, MenuItem, IconButton } from '@mui/material'
import AddModal from "@/components/Pages/AddModal"
import { Settings } from "@mui/icons-material"

const formValue = {
  type: 'Deployment', // 服务类型
  name: '', // 服务名称
  description: '服务描述', // 服务描述
  count: 1, // 副本数量
  account: 'default',
  strategy: 'Always', // 容器组重启策略
  nodeSelect: 'auto',
  volume: {
    name: 'input-volume',
    dir: 'emptyDir'
  },
  container: {
    name: 'dockername',
    image: 'inputimagename',
    strategy: 'Always',
    directory: 'inputwokingdir',
    volumeMountName: 'input-volume',
    cpuLimit: '501m',
    cpuRequest: '501m',
    memoryLimit: '201Mi',
    memoryRequest: '201Mi'
  }
}

const serviceType = [
  {
    label: 'Deployment',
    value: 'Deployment'
  }
]

const volumeDir = [
  {
    label: 'emptyDir',
    value: 'emptyDir'
  }
]

const serviceAccont = [
  {
    label: 'default',
    value: 'default'
  }
]

const podStrategy = [
  {
    label: 'Always',
    value: 'Always'
  }
]

const DeploymentAdd = ({ open, onClose, onFinish }) => {
  const [form, setForm] = useState(JSON.parse(JSON.stringify(formValue)))

  const handleClose = () => {
    onClose()
    setForm(formValue)
  }

  const handleFieldChange = (field, value, subField) => {
    if (subField) {
      const originFieldData = form[field]
      originFieldData[subField] = value
      setForm({ ...form, [field]: originFieldData })

      return
    }
    setForm({ ...form, [field]: value })
  }

  const handleContainerFieldChange = (field, value) => {
    const originContainer = JSON.parse(JSON.stringify(form.container))
    originContainer[field] = value
    setForm({ ...form, container: { ...originContainer } })
  }

  // deployment 添加
  const handleDeploymentAdd = async () => {
    const params = {
      kind: 'Deployment',
      apiVersion: 'apps/v1',
      metadata: {
        namespace: sessionStorage.getItem('namespace'), // 命名空间
        name: form.name, // 服务名称
        annotations: {
          'k8s.kuboard.cn/workload': form.name,
          'k8s.kuboard.cn/displayName': form.description,
          'k8s.kuboard.cn/ingress': 'false',
          'k8s.kuboard.cn/service': 'none',
          inputName: 'inputvalue' // 注解(名称/值)
        },
        labels: {
          inputtagname: 'inputtagvalue', // 标签（名称/值）
          'k8s.kuboard.cn/layer': '',
          'k8s.kuboard.cn/name': form.name
        }
      },
      spec: {
        replicas: form.count, // 副本数量
        selector: {
          matchLabels: {
            inputtagname: 'inputtagvalue', // 标签（名称/值）
            'k8s.kuboard.cn/layer': '',
            'k8s.kuboard.cn/name': form.name
          }
        },
        template: {
          metadata: {
            labels: {
              inputtagname: 'inputtagvalue', // 标签（名称/值）
              'k8s.kuboard.cn/layer': '',
              'k8s.kuboard.cn/name': form.name
            }
          },
          spec: {
            securityContext: {
              seLinuxOptions: {}
            },
            imagePullSecrets: [],
            containers: [
              {
                args: ['inputargs'],
                command: ['inputcommand'],
                env: [
                  {
                    name: 'inputname', // 环境变量 - 变量名
                    value: 'inputvalue' // 环境变量 - 值
                  }
                ],
                envFrom: [],
                image: form.container.image,
                imagePullPolicy: form.container.strategy, // 抓取策略
                livenessProbe: { // 存活检查
                  failureThreshold: 10,
                  initialDelaySeconds: 10,
                  periodSeconds: 10,
                  successThreshold: 1,
                  tcpSocket: {
                    port: 20
                  },
                  timeoutSeconds: 10
                },
                name: form.container.name, // 容器名称
                ports: [
                  { // Ports
                    containerPort: 11,
                    hostPort: 12,
                    name: 'inputports',
                    protocol: 'TCP'
                  }
                ],
                readinessProbe: { // 就绪检查
                  failureThreshold: 10,
                  httpGet: {
                    httpHeaders: [
                      {
                        name: 'name',
                        value: 'value'
                      }
                    ],
                    path: '/inputlujing',
                    port: 33,
                    scheme: 'HTTP'
                  },
                  initialDelaySeconds: 10,
                  periodSeconds: 10,
                  successThreshold: 10,
                  timeoutSeconds: 10,
                  failureThreshold: 10
                },
                resources: { // 资源
                  limits: {
                    cpu: '501m',
                    memory: '201Mi'
                  },
                  requests: {
                    cpu: '500m',
                    memory: '200Mi'
                  }
                },
                volumeMounts: [
                  {
                    mountPath: '/inputrq/data', // 下拉选择项
                    mountPropagation: 'None',
                    name: 'input-volume',
                    // name: form.container.volumeMountName,
                    readOnly: false,
                    subPath: 'data'
                  }
                ],
                workingDir: form.container.directory // 工作目录
              }
            ],
            restartPolicy: form.strategy,
            serviceAccountName: form.account, // 选择 ServiceAccount
            initContainers: [],
            dnsConfig: {
              optoins: []
            },
            volumes: [
              {
                emptyDir: {},
                // name: formValue.volume, // 数据卷 Volume-1 名称
                name: 'input-volume', // 数据卷 Volume-1 名称
              }
            ]
          }
        },
      },
    }
    const resp = await fetch(`/api/deploymentAdd?namespaces=${sessionStorage.getItem('namespace')}`, {
      method: 'post',
      body: JSON.stringify(params)
    })
    const res = await resp.json()
    if (res.data && res.data.status == 'Success') {
      onFinish(true)
      setForm(formValue)
    } else {
      onFinish(false)
    }
  }

  return (
    <AddModal title='创建容器' open={open} maxWidth={'lg'} handleClose={handleClose} onCancel={handleClose} handleOk={handleDeploymentAdd}>
      <Box>
        <Grid container spacing={2} sx={{ mb: '20px' }}>
          <Grid item sm={6}>
            <Card sx={{ minHeight: '400px' }}>
              <CardHeader title='基本信息' sx={{ fontSize: '14px' }}></CardHeader>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Typography component='h4' sx={{ width: '100px' }}>服务类型：</Typography>
                  <FormControl size="small" sx={{ width: '80%' }}>
                    <Select value={form.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
                      {
                        serviceType.map(item => (
                          <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Typography component='h4' sx={{ width: '100px' }}>服务名称：</Typography>
                  <TextField
                    placeholder="请输入服务名称"
                    size="small"
                    sx={{ width: '80%' }}
                    value={form.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                    <Typography component='h4' sx={{ width: '100px' }}>注解：</Typography>
                    <Button variant="outlined">添加</Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                    <Typography component='h4' sx={{ width: '100px' }}>标签：</Typography>
                    <Button variant="outlined">添加</Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Typography component='h4' sx={{ width: '100px' }}>服务描述：</Typography>
                  <TextField
                    placeholder="请输入服务描述"
                    size="small"
                    sx={{ width: '80%' }}
                    value={form.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                  <Typography component='h4' sx={{ width: '100px' }}>副本数量：</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: '80%' }}
                    value={form.count}
                    onChange={(e) => handleFieldChange('count', e.target.value)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ minHeight: '400px' }}>
              <CardHeader title='数据卷 Volumn'></CardHeader>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item sm={6}><TextField label="name" size="small" sx={{ width: '100%' }} value={form.volume.name} /></Grid>
                  <Grid item sm={6}>
                    <FormControl size="small" sx={{ width: '100%' }}>
                      <Select value={form.volume.dir}>
                        {
                          volumeDir.map(item => (
                            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', alignItems: 'center', my: '10px' }}>
                  <Button variant="outlined">添加</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: '20px' }}>
          <Grid item sm={12}>
            <Card sx={{ minHeight: '400px' }}>
              <CardHeader title='运行容器组Pod'></CardHeader>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '120px' }}>ServiceAccount：</Typography>
                      <FormControl size="small" sx={{ width: '70%' }}>
                        <Select value={form.account} onChange={(e) => handleFieldChange('account', e.target.value)}>
                          {
                            serviceAccont.map(item => (
                              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '120px' }}>容器组重启策略：</Typography>
                      <FormControl size="small" sx={{ width: '70%' }}>
                        <Select value={form.strategy} onChange={(e) => handleFieldChange('strategy', e.target.value)}>
                          {
                            podStrategy.map(item => (
                              <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '120px' }}>节点选择：</Typography>
                      <FormControl size="small" sx={{ width: '70%' }}>
                        <RadioGroup row value={form.nodeSelect}>
                          <FormControlLabel value='auto' control={<Radio />} label='自动分配' />
                          <FormControlLabel value='appoint' control={<Radio />} label='指定节点' />
                          <FormControlLabel value='mate' control={<Radio />} label='匹配节点' />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '120px' }}>亲和性/反亲和性：</Typography>
                      <Box sx={{ width: '70%' }}>
                        <Button variant="outlined" startIcon={<Settings />}>节点亲和性设置</Button>
                        <Button variant="outlined" sx={{ ml: '10px' }} startIcon={<Settings />}>Pod亲和性设置</Button>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography component='h3' sx={{ fontSize: '16px', mb: '15px' }}>工作容器</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>容器名称：</Typography>
                      <TextField
                        placeholder="请输入容器名称"
                        size="small"
                        sx={{ width: '75%' }}
                        value={form.container.name}
                        onChange={(e) => handleContainerFieldChange('name', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>镜像：</Typography>
                      <TextField
                        placeholder="请输入镜像"
                        size="small"
                        sx={{ width: '75%' }}
                        value={form.container.image}
                        onChange={(e) => handleContainerFieldChange('image', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>抓取策略：</Typography>
                      <FormControl size="small" sx={{ width: '75%' }}>
                        <Select value={form.container.strategy} onChange={(e) => handleContainerFieldChange('strategy', e.target.value)}>
                          {
                            podStrategy.map(item => (
                              <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>工作目录：</Typography>
                      <TextField
                        placeholder="请输入工作目录"
                        size="small"
                        sx={{ width: '75%' }}
                        value={form.container.directory}
                        onChange={(e) => handleContainerFieldChange('directory', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>volumeMountName：</Typography>
                      <TextField
                        placeholder="请输入"
                        size="small"
                        sx={{ width: '75%' }}
                        value={form.container.volumeMountName}
                        onChange={(e) => handleContainerFieldChange('volumeMountName', e.target.value)}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>Command：</Typography>
                      <Button variant="outlined">添加</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>Args：</Typography>
                      <Button variant="outlined">添加</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>Ports：</Typography>
                      <Button variant="outlined">添加</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>环境变量：</Typography>
                      <Button variant="outlined">+ 名值对</Button>
                      <Button variant="outlined" sx={{ ml: '10px' }}>+ 配置</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>挂载点：</Typography>
                      <Button variant="outlined">添加</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>就绪检查：</Typography>
                      <Button variant="outlined">编辑</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>存活检查：</Typography>
                      <Button variant="outlined">编辑</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>安全设定：</Typography>
                      <Button variant="outlined">编辑</Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>CPU：</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          size="small"
                          placeholder='limit'
                          value={form.container.cpuLimit}
                          onChange={(e) => handleContainerFieldChange('cpuLimit', e.target.value)}
                        />
                        <TextField
                          size="small"
                          placeholder='request'
                          value={form.container.cpuRequest}
                          onChange={(e) => handleContainerFieldChange('cpuRequest', e.target.value)}
                          sx={{ ml: '10px' }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                      <Typography component='h4' sx={{ width: '140px' }}>内存：</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          size="small"
                          placeholder='limit'
                          value={form.container.memoryLimit}
                          onChange={(e) => handleContainerFieldChange('memoryLimit', e.target.value)}
                        />
                        <TextField
                          size="small"
                          placeholder='request'
                          value={form.container.memoryRequest}
                          onChange={(e) => handleContainerFieldChange('memoryRequest', e.target.value)}
                          sx={{ ml: '10px' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AddModal>
  )
}

export default DeploymentAdd