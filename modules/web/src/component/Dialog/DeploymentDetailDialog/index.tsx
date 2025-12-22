import React from 'react';
import {
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab,
  Box,
  Button,
  DialogActions,
} from '@mui/material';
import { Deployment } from '@/types/deployment';
import { Pod } from '@/types/pod';
import { useI18n } from '@/hook/useI18n';
import { formatDateTime, formatStatus, formatRelativeTime } from '@/helper/localization';
import DetailDialog from '../DetailDialog';
import YAMLViewerDialog from '../YAMLViewerDialog';
import { useAlert } from '@/hook/useAlert';
import { copyToClipboard } from '@/helper/util';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface DeploymentDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Deployment | null;
  pods?: Pod[] | null;
}

function DeploymentDetailDialog({ open, onClose, data, pods }: DeploymentDetailDialogProps) {
  const [tab, setTab] = React.useState(0);
  
  // 1. 合并 Hooks 和 State
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const { success } = useAlert();

  const displayPods = pods?.
    filter((pod) => pod.metadata?.ownerReferences?.[0]?.name?.includes(data?.metadata?.name || '')) || [];

  // 2. 保留复制功能的处理函数
  const handleCopyName = async () => {
    if (data?.metadata?.name) {
      await copyToClipboard(String(data.metadata.name));
      success('Copied name');
    }
  };

  const handleCopyUID = async () => {
    if (data?.metadata?.uid) {
      await copyToClipboard(String(data.metadata.uid));
      success('Copied ID');
    }
  };

  return (
    <>
      {/* 3. 使用 main 分支的 DetailDialog 作为外层容器 */}
      <DetailDialog
        open={open}
        onClose={onClose}
        data={data}
        title={`${t("common.deployment")} ${t("actions.detail")}`}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label={t('table.namespace')}
              value={data?.metadata?.namespace}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('table.name')}
              value={data?.metadata?.name}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('table.id')}
              value={data?.metadata?.uid}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={`${t('table.replicas')} (${t('table.availableReplicas')}/${t('table.unavailableReplicas')})`}
              value={`${data?.status?.availableReplicas || 0}/${(data?.status?.replicas || 0) - (data?.status?.availableReplicas || 0)}`}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label={t('table.creationTime')}
              value={formatDateTime(data?.metadata?.creationTimestamp || '', currentLanguage)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Box sx={{ marginTop: 2 }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label={t('table.pods')} />
            <Tab label={t('table.labels')} />
          </Tabs>
        </Box>

        <TabPanel value={tab} index={0}>
          <Table sx={{ marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{`${t('table.name')}/${t('table.id')}`}</TableCell>
                <TableCell>{t('table.node')}</TableCell>
                <TableCell>{t('table.status')}</TableCell>
                <TableCell>{t('table.resource')}</TableCell>
                <TableCell>{t('table.creationTime')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(displayPods?.length || 0) > 0 ? (
                displayPods?.map((pod) => (
                  <TableRow key={pod?.metadata?.uid}>
                    <TableCell>
                      <div>
                        <div style={{ color: 'rgb(47, 84, 235)', marginBottom: '2px' }}>
                          {pod?.metadata?.name}
                        </div>
                        <div>{pod?.metadata?.uid}</div>
                      </div>
                    </TableCell>
                    <TableCell>{pod?.spec?.nodeName}</TableCell>
                    <TableCell>{formatStatus(pod?.status?.phase, currentLanguage)}</TableCell>
                    <TableCell>
                      <div>
                        <div style={{ fontSize: "12px" }}>{t('table.cpu')}: {pod?.spec?.containers?.at(0)?.resources?.requests?.cpu}</div>
                        <div style={{ fontSize: "12px" }}>
                          {t('table.memory')}: {pod?.spec?.containers?.at(0)?.resources?.requests?.memory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ fontSize: '12px' }}>
                        {formatDateTime(pod?.metadata?.creationTimestamp || '', currentLanguage)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'text.secondary' }}>
                        {formatRelativeTime(pod?.metadata?.creationTimestamp || '', currentLanguage)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>
        
        <TabPanel value={tab} index={1}>
          <Table sx={{ marginTop: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('table.key')}</TableCell>
                <TableCell>{t('table.value')}</TableCell>
              </TableRow>
            </TableHead>
            {/* 4. 使用 main 分支的表格逻辑（修复了 feat 分支的重复代码），并嵌入 DialogActions */}
            <TableBody>
              {(Object.keys(data?.metadata?.labels || {})?.length || 0) > 0 ? (
                Object.entries(data?.metadata?.labels || {})?.map((pair) => (
                  <TableRow key={pair[0]}>
                    <TableCell>{pair[0]}</TableCell>
                    <TableCell>{pair[1]}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabPanel>

        {/* 5. 重新添加 feat 分支的按钮功能 */}
        <DialogActions>
          <Button onClick={onClose}>{t('actions.cancel')}</Button>
          <Button onClick={handleCopyName} variant="outlined">Copy Name</Button>
          <Button onClick={handleCopyUID} variant="outlined">Copy ID</Button>
          <Button onClick={() => setYamlDialogOpen(true)} variant="contained">
            YAML
          </Button>
        </DialogActions>
      </DetailDialog>

      {/* 6. 添加 YAML 弹窗 */}
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={() => setYamlDialogOpen(false)}
        content={data}
      />
    </>
  );
}

export default DeploymentDetailDialog;