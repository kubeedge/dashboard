import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { Namespace } from '@/types/namespace';
import { useI18n } from '@/hook/useI18n';

interface MoreSettingFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  namespaces?: Namespace[];
}

const ShowValueOperators = new Set([
  'In',
  'NotIn',
  'Gt',
  'Lt',
]);

export default function MoreSettingForm({ data, onChange, namespaces }: MoreSettingFormProps) {
  const { t } = useI18n();
  const handleAffinityValueChange = (affinity: string, index: number, field: string, value: any) => {
    const newData = [...(data?.[affinity] || [])];
    (newData[index] as any)[field] = value;
    onChange(affinity, newData);
  };

  const handleAddNodeSelector = () => {
    const updatedData = [...(data.nodeSelectors || []), { touched: false }];
    onChange('nodeSelectors', updatedData);
  }

  const handleRemoveNodeSelector = (index: number) => {
    const updatedData = [...(data.nodeSelectors || [])];
    updatedData.splice(index, 1);
    onChange('nodeSelectors', updatedData);
  }

  const handleNodeSelectorChange = (index: number, field: string, value: any) => {
    const newData = [...(data.nodeSelectors || [])];
    (newData[index] as any)[field] = value;
    onChange('nodeSelectors', newData);
  };

  const handleNodeSelectorBlur = (index: number) => {
    const newData = [...(data.nodeSelectors || [])];
    newData[index].touched = true;
    onChange('nodeSelectors', newData);
  };

  const handleAddCondition = (affinity: string, initValue: any = {}) => {
    const newData = data[affinity] || [];
    newData.push(initValue);
    onChange(affinity, newData);
  }

  const handleRemoveCondition = (affinity: string, index: number) => {
    const newData = data[affinity] || [];
    newData?.splice(index, 1);
    onChange(affinity, newData);
  }

  const handleAddAffinityMatchCondition = (affinity: string, index: number, field: string) => {
    const newData = [...(data?.[affinity] || [])];
    if (!newData[index]) {
      newData[index] = {};
    }
    newData[index][field] = [...(newData[index]?.[field] || []), {}];
    onChange(affinity, newData);
  };

  const handleRemoveAffinityMatchCondition = (affinity: string, index: number, field: string, condIndex: number) => {
    const newData = [...(data[affinity] || [{}])];
    newData[index]?.[field]?.splice(condIndex, 1);
    onChange(affinity, newData);
  }

  return (
    <Box padding={2}>
      {/* Node Name */}
      <Typography variant="h6">{t('table.nodeName')}</Typography>
      <TextField
        fullWidth
        placeholder={t('form.pleaseEnterNamePlaceholder')}
        value={data?.nodeName}
        onChange={(e) => onChange('nodeName', e.target.value)}
        margin="normal"
      />

      {/* Node Selector */}
      <Box marginTop={2}>
        <Typography variant="h6">{t('table.nodeSelector')}</Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleAddNodeSelector}
        >
          {t('table.addNodeSelector')}
        </Button>
        {(data?.nodeSelectors || []).map((selector: any, index: number) => (
          <Box key={index} marginTop={1} display="flex" alignItems="center">
            <TextField
              label={t('table.key')}
              placeholder="Please input key"
              value={selector?.key}
              helperText={selector.touched && !selector?.key && t('table.missingKey')}
              error={selector.touched && !selector?.key}
              onBlur={() => handleNodeSelectorBlur(index)}
              onChange={(e) => handleNodeSelectorChange(index, 'key', e.target.value)}
              margin="normal"
            />
            <TextField
              label={t('table.value')}
              placeholder="Please input value"
              value={selector?.value}
              error={selector.touched && !selector?.value} // Add validation logic here
              helperText={selector.touched && !selector?.value && t('table.missingValue')}
              onBlur={() => handleNodeSelectorBlur(index)}
              onChange={(e) => handleNodeSelectorChange(index, 'value', e.target.value)}
              margin="normal"
              style={{ marginLeft: 16 }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveNodeSelector(index)}
              style={{ marginLeft: 16 }}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Strategy */}
      <FormControlLabel
        control={<Checkbox checked={!!data?.setStrategy} onChange={(e) => onChange('setStrategy', e.target.checked)} />}
        label={t('table.strategy')}
        style={{ marginTop: 16 }}
      />
      {data?.setStrategy && (
        <Box marginTop={2}>
          <Typography variant="h6">Set update strategy</Typography>
          <TextField
            label="Min Ready Seconds"
            type="number"
            inputProps={{ min: 1 }}
            value={data?.minReadySeconds}
            onChange={(e) => onChange('minReadySeconds', e.target.value)}
            placeholder="0"
            margin="normal"
            InputProps={{
              endAdornment: <Typography variant="caption">s</Typography>,
            }}
          />
          <TextField
            label="Progress Deadline Seconds"
            type="number"
            inputProps={{ min: 1 }}
            placeholder="0"
            margin="normal"
            value={data?.progressDeadlineSeconds}
            onChange={(e) => onChange('progressDeadlineSeconds', e.target.value)}
            InputProps={{
              endAdornment: <Typography variant="caption">s</Typography>,
            }}
          />
          <TextField
            label="Revision History Limit"
            type="number"
            inputProps={{ min: 1 }}
            placeholder="0"
            margin="normal"
            value={data?.revisionHistoryLimit}
            onChange={(e) => onChange('revisionHistoryLimit', e.target.value)}
          />
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox
                checked={!data?.strategyType || data?.strategyType === 'RollingUpdate'}
                onChange={(e) => onChange('strategyType', e.target.checked ? 'RollingUpdate' : 'Recreate')} />}
              label="Rolling Update"
            />
            <FormControlLabel
              control={<Checkbox
                checked={data?.strategyType === 'Recreate'}
                onChange={(e) => onChange('strategyType', e.target.checked ? 'Recreate' : 'RollingUpdate')} />}
              label="Recreate"
            />
          </FormGroup>
          {(!data?.strategyType || data?.strategyType === 'RollingUpdate') && (
            <Box marginTop={2}>
              <TextField
                label="Max Unavailable"
                placeholder="Please enter"
                margin="normal"
                value={data?.maxUnavailable}
                onChange={(e) => onChange('maxUnavailable', e.target.value)}
              />
              <TextField
                label="Max Surge"
                placeholder="Please enter"
                margin="normal"
                value={data?.maxSurge}
                onChange={(e) => onChange('maxSurge', e.target.value)}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Node Affinity */}
      <FormControlLabel
        control={<Checkbox checked={!!data?.setNodeAffinity} onChange={(e) => onChange('setNodeAffinity', e.target.checked)} />}
        label={t('table.nodeAffinity')}
        style={{ marginTop: 16 }}
      />
      {data?.setNodeAffinity && (
        <Box marginTop={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('nodeAffinityRequiredConditions')}
            style={{ marginTop: 16 }}
          >
            Add condition which is required during scheduling and ignored during execution
          </Button>
          {(data?.nodeAffinityRequiredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Required Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('nodeAffinityRequiredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                    <MenuItem key="Gt" value="Gt">Gt</MenuItem>
                    <MenuItem key="Lt" value="Lt">Lt</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('nodeAffinityRequiredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('nodeAffinityRequiredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchFields || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchFields || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchFields', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchFields || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchFields', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                    <MenuItem key="Gt" value="Gt">Gt</MenuItem>
                    <MenuItem key="Lt" value="Lt">Lt</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchFields || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('nodeAffinityRequiredConditions', condIndex, 'matchFields', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('nodeAffinityRequiredConditions', condIndex, 'matchFields', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('nodeAffinityRequiredConditions', condIndex, 'matchFields')}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('nodeAffinityPreferredConditions', { weight: 50 })}
            style={{ marginTop: 16 }}
          >
            Add condition which is preferred during scheduling and ignored during execution
          </Button>
          {(data?.nodeAffinityPreferredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('nodeAffinityPreferredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Slider
                value={condition?.weight}
                onChange={(e, newValue) => {
                  handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'weight', Number(newValue));
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                    <MenuItem key="Gt" value="Gt">Gt</MenuItem>
                    <MenuItem key="Lt" value="Lt">Lt</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('nodeAffinityPreferredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('nodeAffinityPreferredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchFields || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchFields || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchFields', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchFields || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchFields', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                    <MenuItem key="Gt" value="Gt">Gt</MenuItem>
                    <MenuItem key="Lt" value="Lt">Lt</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchFields || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('nodeAffinityPreferredConditions', condIndex, 'matchFields', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('nodeAffinityPreferredConditions', condIndex, 'matchFields', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('nodeAffinityPreferredConditions', condIndex, 'matchFields')}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <FormControlLabel
        control={<Checkbox checked={!!data?.setPodAffinity} onChange={(e) => onChange('setPodAffinity', e.target.checked)} />}
        label={t('table.podAffinity')}
        style={{ marginTop: 16 }}
      />
      {data?.setPodAffinity && (
        <Box marginTop={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('podAffinityRequiredConditions')}
            style={{ marginTop: 16 }}
          >
            Add condition which is required during scheduling and ignored during execution
          </Button>
          {(data?.podAffinityRequiredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Required Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('podAffinityRequiredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchLabels || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                  />
                  <TextField
                    label="Values"
                    fullWidth
                    placeholder="Please input values"
                    margin="normal"
                    value={expr?.values || []}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].values = e.target.value;
                      handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAffinityRequiredConditions', condIndex, 'matchLabels', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAffinityRequiredConditions', condIndex, 'matchLabels')}
                style={{ marginTop: 8 }}
              >
                Add Match Labels
              </Button>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAffinityRequiredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAffinityRequiredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Box marginTop={1} display="flex" alignItems="center">
                <TextField
                  select
                  value={condition.namespace || ''}
                  onChange={(e) => handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'namespace', e.target.value)}
                  label="Namespace"
                  placeholder="Please input namespace"
                  margin="normal"
                  fullWidth>
                  {namespaces?.map((item) => (
                    <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                      {item?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={condition.topology}
                  onChange={(e) => handleAffinityValueChange('podAffinityRequiredConditions', condIndex, 'topology', e.target.value)}
                  label="Topology Key"
                  placeholder="Please input topology key"
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('podAffinityPreferredConditions', { weight: 50 })}
            style={{ marginTop: 16 }}
          >
            Add condition which is preferred during scheduling and ignored during execution
          </Button>
          {(data?.podAffinityPreferredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('podAffinityPreferredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Slider
                value={condition?.weight}
                onChange={(e, newValue) => {
                  handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'weight', Number(newValue));
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchLabels || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                  />
                  <TextField
                    label="Values"
                    fullWidth
                    placeholder="Please input values"
                    margin="normal"
                    value={expr?.values || []}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].values = e.target.value;
                      handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAffinityPreferredConditions', condIndex, 'matchLabels', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAffinityPreferredConditions', condIndex, 'matchLabels')}
                style={{ marginTop: 8 }}
              >
                Add Match Labels
              </Button>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAffinityPreferredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAffinityPreferredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Box marginTop={1} display="flex" alignItems="center">
                <TextField
                  select
                  value={condition.namespace || ''}
                  onChange={(e) => handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'namespace', e.target.value)}
                  label="Namespace"
                  placeholder="Please input namespace"
                  margin="normal"
                  fullWidth>
                  {namespaces?.map((item) => (
                    <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                      {item?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={condition.topology}
                  onChange={(e) => handleAffinityValueChange('podAffinityPreferredConditions', condIndex, 'topology', e.target.value)}
                  label="Topology Key"
                  placeholder="Please input topology key"
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <FormControlLabel
        control={<Checkbox checked={!!data?.setPodAntiAffinity} onChange={(e) => onChange('setPodAntiAffinity', e.target.checked)} />}
        label={t('table.podAntiAffinity')}
        style={{ marginTop: 16 }}
      />
      {data?.setPodAntiAffinity && (
        <Box marginTop={2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('podAntiAffinityRequiredConditions')}
            style={{ marginTop: 16 }}
          >
            Add condition which is required during scheduling and ignored during execution
          </Button>
          {(data?.podAntiAffinityRequiredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Required Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('podAntiAffinityRequiredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchLabels || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                  />
                  <TextField
                    label="Values"
                    fullWidth
                    placeholder="Please input values"
                    margin="normal"
                    value={expr?.values || []}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].values = e.target.value;
                      handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAntiAffinityRequiredConditions', condIndex, 'matchLabels', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAntiAffinityRequiredConditions', condIndex, 'matchLabels')}
                style={{ marginTop: 8 }}
              >
                Add Match Labels
              </Button>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAntiAffinityRequiredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAntiAffinityRequiredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Box marginTop={1} display="flex" alignItems="center">
                <TextField
                  select
                  value={condition.namespace || ''}
                  onChange={(e) => handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'namespace', e.target.value)}
                  label="Namespace"
                  placeholder="Please input namespace"
                  margin="normal"
                  fullWidth>
                  {namespaces?.map((item) => (
                    <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                      {item?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={condition.topology}
                  onChange={(e) => handleAffinityValueChange('podAntiAffinityRequiredConditions', condIndex, 'topology', e.target.value)}
                  label="Topology Key"
                  placeholder="Please input topology key"
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>
          ))}

          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => handleAddCondition('podAntiAffinityPreferredConditions', { weight: 50 })}
            style={{ marginTop: 16 }}
          >
            Add condition which is preferred during scheduling and ignored during execution
          </Button>
          {(data?.podAntiAffinityPreferredConditions || []).map((condition: any, condIndex: number) => (
            <Box key={condIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {condIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveCondition('podAntiAffinityPreferredConditions', condIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Slider
                value={condition?.weight}
                onChange={(e, newValue) => {
                  handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'weight', Number(newValue));
                }}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {(condition?.matchLabels || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                  />
                  <TextField
                    label="Values"
                    fullWidth
                    placeholder="Please input values"
                    margin="normal"
                    value={expr?.values || []}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchLabels || [{}])];
                      updatedExprs[exprIndex].values = e.target.value;
                      handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'matchLabels', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAntiAffinityPreferredConditions', condIndex, 'matchLabels', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAntiAffinityPreferredConditions', condIndex, 'matchLabels')}
                style={{ marginTop: 8 }}
              >
                Add Match Labels
              </Button>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {(condition?.matchExpressions || []).map((expr: any, exprIndex: number) => (
                <Box key={exprIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label={t('table.key')}
                    fullWidth
                    placeholder="Please input key"
                    margin="normal"
                    value={expr?.key}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].key = e.target.value;
                      handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    value={expr?.operator || ''}
                    onChange={(e) => {
                      const updatedExprs = [...(condition?.matchExpressions || [{}])];
                      updatedExprs[exprIndex].operator = e.target.value;
                      handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                    }}
                    style={{ marginLeft: 16 }}>
                    <MenuItem key="In" value="In">In</MenuItem>
                    <MenuItem key="NotIn" value="NotIn">NotIn</MenuItem>
                    <MenuItem key="Exists" value="Exists">Exists</MenuItem>
                    <MenuItem key="DoesNotExist" value="DoesNotExist">DoesNotExist</MenuItem>
                  </TextField>
                  {ShowValueOperators.has(expr?.operator) && (
                    <TextField
                      label="Values"
                      fullWidth
                      placeholder="Please input values"
                      margin="normal"
                      value={expr?.values || []}
                      onChange={(e) => {
                        const updatedExprs = [...(condition?.matchExpressions || [{}])];
                        updatedExprs[exprIndex].values = e.target.value;
                        handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'matchExpressions', updatedExprs);
                      }}
                      style={{ marginLeft: 16 }}
                    />
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveAffinityMatchCondition('podAntiAffinityPreferredConditions', condIndex, 'matchExpressions', exprIndex)}
                    style={{ marginLeft: 16 }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => handleAddAffinityMatchCondition('podAntiAffinityPreferredConditions', condIndex, 'matchExpressions')}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Box marginTop={1} display="flex" alignItems="center">
                <TextField
                  select
                  value={condition.namespace || ''}
                  onChange={(e) => handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'namespace', e.target.value)}
                  label="Namespace"
                  placeholder="Please input namespace"
                  margin="normal"
                  fullWidth>
                  {namespaces?.map((item) => (
                    <MenuItem key={item?.metadata?.uid} value={item?.metadata?.name}>
                      {item?.metadata?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={condition.topology}
                  onChange={(e) => handleAffinityValueChange('podAntiAffinityPreferredConditions', condIndex, 'topology', e.target.value)}
                  label="Topology Key"
                  placeholder="Please input topology key"
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
