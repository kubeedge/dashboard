import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  const [yamlDialogOpen, setYamlDialogOpen] = React.useState(false);
  const { success } = useAlert();

  const handleYamlOpen = () => {
    setYamlDialogOpen(true);
  };

  const handleYamlClose = () => {
    setYamlDialogOpen(false);
  };

  const displayPods = pods?.filter((pod) => pod.metadata?.ownerReferences?.[0]?.name?.includes(data?.metadata?.name || '')) || [];

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
      <Dialog open={!!open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Device Detail</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Namespace"
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
                label="Name"
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
                label="ID"
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
                label="Replicas (available/unavailable)"
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
                label="Creation Time"
                value={data?.metadata?.creationTimestamp || ''}
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
              <Tab label="Pods" />
              <Tab label="Labels" />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0}>
            <Table sx={{ marginTop: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name/ID</TableCell>
                  <TableCell>Node</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Creation Time</TableCell>
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
                      <TableCell>{pod?.status?.phase}</TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontSize: "12px" }}>CPU: {pod?.spec?.containers?.at(0)?.resources?.requests?.cpu}</div>
                          <div style={{ fontSize: "12px" }}>
                            Memory: {pod?.spec?.containers?.at(0)?.resources?.requests?.memory}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{pod?.metadata?.creationTimestamp}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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
                  <TableCell>Label Key</TableCell>
                  <TableCell>Label Value</TableCell>
                </TableRow>
              </TableHead>
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
                    <TableCell colSpan={4} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleCopyName} variant="outlined">Copy Name</Button>
          <Button onClick={handleCopyUID} variant="outlined">Copy ID</Button>
          <Button onClick={handleYamlOpen} variant="contained">
            YAML
          </Button>
        </DialogActions>
      </Dialog>
      <YAMLViewerDialog
        open={yamlDialogOpen}
        onClose={handleYamlClose}
        content={data}
      />
    </>
  );
}

export default DeploymentDetailDialog;
