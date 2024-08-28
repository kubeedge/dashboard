import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

const MoreSettingForm: React.FC = () => {
  const [nodeSelectors, setNodeSelectors] = useState([{ key: '', value: '' }]);
  const [updateStrategy, setUpdateStrategy] = useState('');
  const [nodeAffinity, setNodeAffinity] = useState(false);
  const [podAffinity, setPodAffinity] = useState(false);
  const [PodAntiAffinity, setPodAntiAffinity] = useState(false);
  const [rollingUpdate, setRollingUpdate] = useState(false);
  const [requiredConditions, setRequiredConditions] = useState([{ matchExpressions: [{}], matchFields: [{}] }]);
  const [preferredConditions, setPreferredConditions] = useState([{ matchExpressions: [{}], matchFields: [{}], weight: 0 }]);
  const [podRequiredConditions, setPodRequiredConditions] = useState([{ matchExpressions: [{}], matchFields: [{}], namespace: '', topologyKey: '' }]);
  const [podPreferredConditions, setPodPreferredConditions] = useState([{ matchExpressions: [{}], matchFields: [{}], weight: 0, namespace: '', topologyKey: '' }]);

  const handleAddNodeSelector = () => setNodeSelectors([...nodeSelectors, { key: '', value: '' }]);
  const handleRemoveNodeSelector = (index: number) => setNodeSelectors(nodeSelectors.filter((_, i) => i !== index));

  const handleAddRequiredCondition = () => setRequiredConditions([...requiredConditions, { matchExpressions: [{}], matchFields: [{}] }]);
  const handleRemoveRequiredCondition = (index: number) => setRequiredConditions(requiredConditions.filter((_, i) => i !== index));

  const handleAddMatchExpression = (conditionIndex: number) => {
    const updatedConditions = [...requiredConditions];
    updatedConditions[conditionIndex].matchExpressions.push({});
    setRequiredConditions(updatedConditions);
  };

  const handleRemoveMatchExpression = (conditionIndex: number, expressionIndex: number) => {
    const updatedConditions = [...requiredConditions];
    updatedConditions[conditionIndex].matchExpressions.splice(expressionIndex, 1);
    setRequiredConditions(updatedConditions);
  };

  const handleAddMatchField = (conditionIndex: number) => {
    const updatedConditions = [...requiredConditions];
    updatedConditions[conditionIndex].matchFields.push({});
    setRequiredConditions(updatedConditions);
  };

  const handleRemoveMatchField = (conditionIndex: number, fieldIndex: number) => {
    const updatedConditions = [...requiredConditions];
    updatedConditions[conditionIndex].matchFields.splice(fieldIndex, 1);
    setRequiredConditions(updatedConditions);
  };

  const handleAddPreferredCondition = () => setPreferredConditions([...preferredConditions, { matchExpressions: [{}], matchFields: [{}], weight: 0 }]);
  const handleRemovePreferredCondition = (index: number) => setPreferredConditions(preferredConditions.filter((_, i) => i !== index));

  const handleAddPreferredMatchExpression = (conditionIndex: number) => {
    const updatedConditions = [...preferredConditions];
    updatedConditions[conditionIndex].matchExpressions.push({});
    setPreferredConditions(updatedConditions);
  };

  const handleRemovePreferredMatchExpression = (conditionIndex: number, expressionIndex: number) => {
    const updatedConditions = [...preferredConditions];
    updatedConditions[conditionIndex].matchExpressions.splice(expressionIndex, 1);
    setPreferredConditions(updatedConditions);
  };

  const handleAddPreferredMatchField = (conditionIndex: number) => {
    const updatedConditions = [...preferredConditions];
    updatedConditions[conditionIndex].matchFields.push({});
    setPreferredConditions(updatedConditions);
  };

  const handleRemovePreferredMatchField = (conditionIndex: number, fieldIndex: number) => {
    const updatedConditions = [...preferredConditions];
    updatedConditions[conditionIndex].matchFields.splice(fieldIndex, 1);
    setPreferredConditions(updatedConditions);
  };

  const handleWeightChange = (index: number, newValue: number) => {
    const totalWeight = preferredConditions.reduce((sum, cond) => sum + cond.weight, 0);
    if (totalWeight - preferredConditions[index].weight + newValue <= 100) {
      const updatedConditions = [...preferredConditions];
      updatedConditions[index].weight = newValue;
      setPreferredConditions(updatedConditions);
    }
  };

  const handleAddPodRequiredCondition = () => setPodRequiredConditions([...podRequiredConditions, { matchExpressions: [{}], matchFields: [{}], namespace: '', topologyKey: '' }]);
  const handleRemovePodRequiredCondition = (index: number) => setPodRequiredConditions(podRequiredConditions.filter((_, i) => i !== index));

  const handleAddPodPreferredCondition = () => setPodPreferredConditions([...podPreferredConditions, { matchExpressions: [{}], matchFields: [{}], weight: 0, namespace: '', topologyKey: '' }]);
  const handleRemovePodPreferredCondition = (index: number) => setPodPreferredConditions(podPreferredConditions.filter((_, i) => i !== index));

  const handlePodWeightChange = (index: number, newValue: number) => {
    const totalWeight = podPreferredConditions.reduce((sum, cond) => sum + cond.weight, 0);
    if (totalWeight - podPreferredConditions[index].weight + newValue <= 100) {
      const updatedConditions = [...podPreferredConditions];
      updatedConditions[index].weight = newValue;
      setPodPreferredConditions(updatedConditions);
    }
  };

  return (
    <Box padding={2}>
      {/* Node Name */}
      <Typography variant="h6">Node Name</Typography>
      <TextField
        fullWidth
        placeholder="Please enter name"
        error={false} // Add validation logic here
        helperText="Miss name"
        margin="normal"
      />

      {/* Node Selector */}
      <Box marginTop={2}>
        <Typography variant="h6">Node Selector</Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleAddNodeSelector}
        >
          Add Node Selector
        </Button>
        {nodeSelectors.map((_, index) => (
          <Box key={index} marginTop={1} display="flex" alignItems="center">
            <TextField
              label="Key"
              placeholder="Please input key"
              error={false} // Add validation logic here
              helperText="Missing key"
              margin="normal"
            />
            <TextField
              label="Value"
              placeholder="Please input value"
              error={false} // Add validation logic here
              helperText="Missing value"
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
        control={<Checkbox checked={updateStrategy !== ''} onChange={() => setUpdateStrategy(updateStrategy ? '' : 'RollingUpdate')} />}
        label="Strategy"
        style={{ marginTop: 16 }}
      />
      {updateStrategy && (
        <Box marginTop={2}>
          <Typography variant="h6">Set update strategy</Typography>
          <TextField
            label="Min Ready Seconds"
            type="number"
            inputProps={{ min: 1 }}
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
          />
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={rollingUpdate} onChange={() => setRollingUpdate(!rollingUpdate)} />}
              label="Rolling Update"
            />
            <FormControlLabel
              control={<Checkbox checked={!rollingUpdate} onChange={() => setRollingUpdate(false)} />}
              label="Recreate"
            />
          </FormGroup>
          {rollingUpdate && (
            <Box marginTop={2}>
              <TextField
                label="Max Unavailable"
                placeholder="Please enter"
                margin="normal"
              />
              <TextField
                label="Max Surge"
                placeholder="Please enter"
                margin="normal"
              />
            </Box>
          )}
        </Box>
      )}

      {/* Node Affinity */}
      <FormControlLabel
        control={<Checkbox checked={nodeAffinity} onChange={() => setNodeAffinity(!nodeAffinity)} />}
        label="Node Affinity"
        style={{ marginTop: 16 }}
      />
      {nodeAffinity && (
        <Box marginTop={2}>
          <Typography variant="h6">Required Node Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddRequiredCondition}
            style={{ marginTop: 16 }}
          >
            Add Required Condition
          </Button>
          {requiredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemoveRequiredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}

          <Typography variant="h6" marginTop={4}>Preferred Node Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPreferredCondition}
            style={{ marginTop: 16 }}
          >
            Add Preferred Condition
          </Button>
          {preferredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemovePreferredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <Slider
                value={condition.weight}
                onChange={(e, newValue) => handleWeightChange(conditionIndex, newValue as number)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                // margin="normal"
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddPreferredMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddPreferredMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Pod Affinity */}
      <FormControlLabel
        control={<Checkbox checked={podAffinity} onChange={() => setPodAffinity(!podAffinity)} />}
        label="Pod Affinity"
        style={{ marginTop: 16 }}
      />
      {podAffinity && (
        <Box marginTop={2}>
          <Typography variant="h6">Required Pod Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPodRequiredCondition}
            style={{ marginTop: 16 }}
          >
            Add Required Condition
          </Button>
          {podRequiredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemovePodRequiredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <TextField
                label="Namespace"
                placeholder="Please input namespace"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Topology Key"
                placeholder="Please input topology key"
                margin="normal"
                fullWidth
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
          <Typography variant="h6" marginTop={4}>Preferred Pod Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPreferredCondition}
            style={{ marginTop: 16 }}
          >
            Add Preferred Condition
          </Button>
          {preferredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemovePreferredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <TextField
                label="Namespace"
                placeholder="Please input namespace"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Topology Key"
                placeholder="Please input topology key"
                margin="normal"
                fullWidth
              />

              <Slider
                value={condition.weight}
                onChange={(e, newValue) => handleWeightChange(conditionIndex, newValue as number)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                // margin="normal"
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddPreferredMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddPreferredMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Pod Anti Affinity */}
      <FormControlLabel
        control={<Checkbox checked={PodAntiAffinity} onChange={() => setPodAntiAffinity(!PodAntiAffinity)} />}
        label="Pod Anti Affinity"
        style={{ marginTop: 16 }}
      />
      {PodAntiAffinity && (
        <Box marginTop={2}>
          <Typography variant="h6">Required Pod Anti Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPodRequiredCondition}
            style={{ marginTop: 16 }}
          >
            Add Required Condition
          </Button>
          {podRequiredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemovePodRequiredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <TextField
                label="Namespace"
                placeholder="Please input namespace"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Topology Key"
                placeholder="Please input topology key"
                margin="normal"
                fullWidth
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
          <Typography variant="h6" marginTop={4}>Preferred Pod Anti Affinity</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleAddPreferredCondition}
            style={{ marginTop: 16 }}
          >
            Add Preferred Condition
          </Button>
          {preferredConditions.map((condition, conditionIndex) => (
            <Box key={conditionIndex} marginTop={2} padding={2} border={1} borderColor="grey.300" position="relative">
              <Typography variant="subtitle1">Preferred Condition {conditionIndex + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => handleRemovePreferredCondition(conditionIndex)}
                style={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <TextField
                label="Namespace"
                placeholder="Please input namespace"
                margin="normal"
                fullWidth
              />
              <TextField
                label="Topology Key"
                placeholder="Please input topology key"
                margin="normal"
                fullWidth
              />
              
              <Slider
                value={condition.weight}
                onChange={(e, newValue) => handleWeightChange(conditionIndex, newValue as number)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={1}
                marks
                // margin="normal"
                style={{ marginTop: 16 }}
              />

              <Typography variant="body1" marginTop={2}>Match Expressions</Typography>
              {condition.matchExpressions.map((_, expressionIndex) => (
                <Box key={expressionIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchExpression(conditionIndex, expressionIndex)}
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
                onClick={() => handleAddPreferredMatchExpression(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Expression
              </Button>

              <Typography variant="body1" marginTop={2}>Match Fields</Typography>
              {condition.matchFields.map((_, fieldIndex) => (
                <Box key={fieldIndex} marginTop={1} display="flex" alignItems="center">
                  <TextField
                    label="Key"
                    placeholder="Please input key"
                    margin="normal"
                  />
                  <TextField
                    label="Operator"
                    placeholder="Please input operator"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <TextField
                    label="Values"
                    placeholder="Please input values"
                    margin="normal"
                    style={{ marginLeft: 16 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemovePreferredMatchField(conditionIndex, fieldIndex)}
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
                onClick={() => handleAddPreferredMatchField(conditionIndex)}
                style={{ marginTop: 8 }}
              >
                Add Match Field
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default MoreSettingForm;
