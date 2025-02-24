import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  IconButton,
  Typography,
  FormLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ConfigMap } from '@/types/configMap';
import { Secret } from '@/types/secret';

interface StorageMountFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
  configMaps: ConfigMap[];
  secrets: Secret[];
}

export default function StorageMountForm({ data, onChange, configMaps, secrets }: StorageMountFormProps) {
  const handleAddVolume = () => {
    const updatedData = [...(data.volumes || []), { }];
    onChange('volumes', updatedData);
  }

  const handleRemoveVolume = (index: number) => {
    const updatedData = [...(data.volumes || [])];
    updatedData.splice(index, 1);
    onChange('volumes', updatedData);
  }

  const handleValueChange = (index: number, field: string, value: any) => {
    const newData = [...(data.volumes || [])];
    (newData[index] as any)[field] = value;
    onChange('volumes', newData);
  };

  const handleAddKeyToPath = (index: number) => {
    const newData = [...(data.volumes || [])];
    newData[index].keyToPaths = [...(newData[index].keyToPaths || []), {}];
    onChange('volumes', newData);
  };

  const handleRemoveKeyToPath = (index: number, envIndex: number) => {
    const newData = [...(data.volumes || [{}])];
    newData[index].keyToPaths?.splice(envIndex, 1);
    onChange('containers', newData);
  }

  const handleAddMountContainer = (index: number) => {
    const newData = [...(data.volumes || [])];
    newData[index].mountContainers = [...(newData[index].mountContainers || []), {}];
    onChange('volumes', newData);
  };

  const handleRemoveMountContainer = (index: number, conIndex: number) => {
    const newData = [...(data.volumes || [{}])];
    newData[index].mountContainers?.splice(conIndex, 1);
    onChange('containers', newData);
  }

  const renderVolumeForm = (volume: any, index: number) => (
    <Box key={volume.id} sx={{ display: 'flex', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: '#0fbe8f',
          p: 2,
          width: '30%',
          position: 'relative',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" color="white">
          Volume
        </Typography>
        <Typography variant="subtitle1" color="white">
          {volume?.name || ''}
        </Typography>
        <IconButton
          color="error"
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={() => handleRemoveVolume(index)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          width: '70%',
          p: 2,
          border: '1px solid #ddd',
          borderRadius: 1,
        }}
      >
        <TextField
          label="Name"
          required
          fullWidth
          margin="normal"
          placeholder="Please enter name"
          value={volume.name}
          onChange={(e) => handleValueChange(index, 'name', e.target.value)}
          error={!volume.name}
          helperText={!volume.name ? 'Miss name' : ''}
        />

        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel>Type</FormLabel>
          <RadioGroup
            row
            value={volume?.type}
            onChange={(e) => handleValueChange(index, 'type', e.target.value)}
          >
            <FormControlLabel value="EmptyDir" control={<Radio />} label="EmptyDir" />
            <FormControlLabel value="HostPath" control={<Radio />} label="HostPath" />
            <FormControlLabel value="ConfigMap" control={<Radio />} label="ConfigMap" />
            <FormControlLabel value="Secret" control={<Radio />} label="Secret" />
          </RadioGroup>
        </FormControl>

        {/* Conditional rendering for different types */}
        {volume.type === 'HostPath' && (
          <>
            <TextField
              label="Host Path"
              required
              fullWidth
              margin="normal"
              placeholder="Please enter"
              value={volume?.hostPath}
              onChange={(e) => handleValueChange(index, 'hostPath', e.target.value)}
              error={!volume?.hostPath}
              helperText={!volume?.hostPath ? 'Missing path' : ''}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Host Path Type</InputLabel>
              <Select
                label="Host Path Type"
                value={volume?.hostPathType || ''}
                onChange={(e) => handleValueChange(index, 'hostPathType', e.target.value)}
              >
                <MenuItem value="EmptyStringDirectoryOrCreate">EmptyStringDirectoryOrCreate</MenuItem>
                <MenuItem value="Directory">Directory</MenuItem>
                <MenuItem value="FileOrCreate">FileOrCreate</MenuItem>
                <MenuItem value="File">File</MenuItem>
                <MenuItem value="Socket">Socket</MenuItem>
                <MenuItem value="CharDevice">CharDevice</MenuItem>
                <MenuItem value="BlockDevice">BlockDevice</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        {volume.type === 'ConfigMap' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>ConfigMap</InputLabel>
            <Select
              label="ConfigMap"
              value={volume?.configMap || ''}
              onChange={(e) => handleValueChange(index, 'configMap', e.target.value)}
              error={!volume?.configMap}
            >
              {configMaps.map((configMap) => (
                <MenuItem key={configMap?.metadata?.uid} value={configMap?.metadata?.name}>
                  {configMap?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {volume.type === 'Secret' && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Secret Name</InputLabel>
            <Select
              label="Secret Name"
              value={volume.secret || ''}
              onChange={(e) => handleValueChange(index, 'secret', e.target.value)}
              error={!volume.secret}
            >
              {secrets.map((secret) => (
                <MenuItem key={secret?.metadata?.uid} value={secret?.metadata?.name}>
                  {secret?.metadata?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(volume.type === 'ConfigMap' || volume.type === 'Secret') && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleAddKeyToPath(index)}
              fullWidth
            >
              + Add KeyToPath
            </Button>
            {(volume.keyToPaths || []).map((keyValue: any, keyIndex: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  label="Key"
                  required
                  value={keyValue.key}
                  onChange={(e) => {
                    const updatedKeyToPaths = [...(volume?.keyToPaths || [{}])];
                    updatedKeyToPaths[keyIndex].key = e.target.value;
                    handleValueChange(index, 'keyToPaths', updatedKeyToPaths);
                  }}
                  margin="normal"
                  placeholder="Please input key"
                  error={!keyValue.key}
                  helperText={!keyValue.key ? 'Missing key' : ''}
                />
                <TextField
                  label="Value"
                  required
                  value={keyValue.value}
                  onChange={(e) => {
                    const updatedKeyToPaths = [...(volume?.keyToPaths || [{}])];
                    updatedKeyToPaths[keyIndex].value = e.target.value;
                    handleValueChange(index, 'keyToPaths', updatedKeyToPaths);
                  }}
                  margin="normal"
                  placeholder="Please input value"
                  error={!keyValue.value}
                  helperText={!keyValue.value ? 'Missing value' : ''}
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveKeyToPath(index, keyIndex)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}


        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => handleAddMountContainer(index)}
            fullWidth
          >
            + Add Mount Container
          </Button>
          {(volume?.mountContainers || []).map((container: any, conIndex: number) => (
            <Box key={conIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Container</InputLabel>
                <Select
                  label="Container"
                  value={container.container}
                  onChange={(e) => {
                    const updatedContainers = [...(volume?.mountContainers || [{}])];
                    updatedContainers[conIndex].container = e.target.value;
                    handleValueChange(index, 'mountContainers', updatedContainers);
                  }}
                  error={!container.container}
                >
                  {data?.containers?.map((container: any) => (
                    <MenuItem key={container.name} value={container.name}>
                      {container.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Mount Path"
                required
                value={container.mountPath}
                onChange={(e) => {
                  const updatedContainers = [...(volume?.mountContainers || [{}])];
                    updatedContainers[conIndex].mountPath = e.target.value;
                    handleValueChange(index, 'mountContainers', updatedContainers);
                }}
                margin="normal"
                placeholder="Please input mountPath"
                error={!container.mountPath}
                helperText={!container.mountPath ? 'Missing mountPath' : ''}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveMountContainer(index, conIndex)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddVolume()}
        fullWidth
      >
        Add Volume
      </Button>
      {data?.volumes?.map(renderVolumeForm)}
    </Box>
  );
}
