import React from 'react';
import {
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Device } from '@/types/device';
import { useI18n } from '@/hook/useI18n';
import { DetailDialog } from '@/component';
import { formatDateTime } from '@/helper/localization';

interface DeviceDetailDialogProps {
  open?: boolean;
  onClose?: () => void;
  data?: Device | null;
}

function DeviceDetailDialog({ open, onClose, data }: DeviceDetailDialogProps) {
  const { t, getCurrentLanguage } = useI18n();
  const currentLanguage = getCurrentLanguage();

  return (
    <DetailDialog
      open={open}
      onClose={onClose}
      data={data}
      title={`${t("common.device")} ${t("actions.detail")}`}
    >
      <Grid container spacing={2}>
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
            label={t('table.protocol')}
            value={data?.spec?.protocol?.protocolName}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label={t('table.nodeName')}
            value={data?.spec?.nodeName}
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
            value={formatDateTime(data?.metadata?.creationTimestamp, currentLanguage)}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            label={t('table.description')}
            value={data?.metadata?.labels?.description}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Table sx={{ marginTop: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.attributeName')}</TableCell>
            <TableCell>{t('table.type')}</TableCell>
            <TableCell>{t('table.attributeValue')}</TableCell>
            <TableCell>{t('table.reportedValue')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data?.status?.twins?.length || 0) > 0 ? (
            data?.status?.twins?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.propertyName}</TableCell>
                <TableCell>{item?.observedDesired?.metadata?.type}</TableCell>
                <TableCell>{item?.observedDesired?.metadata?.value}</TableCell>
                <TableCell>{item?.reported?.value}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                {t("table.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DetailDialog>
  )
}

export default DeviceDetailDialog;
