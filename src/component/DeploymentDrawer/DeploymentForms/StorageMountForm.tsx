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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function StorageMountForm() {
  const [volumes, setVolumes] = useState<{ id: number; type: string; data: any }[]>([]);
  const [newVolumeId, setNewVolumeId] = useState(0);

  const handleAddVolume = () => {
    setVolumes([...volumes, { id: newVolumeId, type: '', data: {} }]);
    setNewVolumeId(newVolumeId + 1);
  };

  const handleRemoveVolume = (id: number) => {
    setVolumes(volumes.filter(volume => volume.id !== id));
  };

  const handleVolumeTypeChange = (id: number, type: string) => {
    const updatedVolumes = volumes.map(volume =>
      volume.id === id ? { ...volume, type, data: {} } : volume
    );
    setVolumes(updatedVolumes);
  };

  const handleVolumeDataChange = (id: number, field: string, value: any) => {
    const updatedVolumes = volumes.map(volume =>
      volume.id === id
        ? { ...volume, data: { ...volume.data, [field]: value } }
        : volume
    );
    setVolumes(updatedVolumes);
  };

  const renderVolumeForm = (volume: { id: number; type: string; data: any }) => (
    <Box key={volume.id} sx={{ display: 'flex', mb: 2 }}>
      <Box
        sx={{
          backgroundColor: '#0fbe8f',
          p: 2,
          width: '30%',
          position: 'relative',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1" color="white">
          Volume
        </Typography>
        <IconButton
          color="error"
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={() => handleRemoveVolume(volume.id)}
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
          onChange={(e) => handleVolumeDataChange(volume.id, 'name', e.target.value)}
          error={!volume.data.name}
          helperText={!volume.data.name ? 'Miss name' : ''}
        />

        <FormControl component="fieldset" fullWidth margin="normal">
          <FormControlLabel
            control={
              <RadioGroup
                row
                value={volume.type}
                onChange={(e) => handleVolumeTypeChange(volume.id, e.target.value)}
              >
                <FormControlLabel value="EmptyDir" control={<Radio />} label="EmptyDir" />
                <FormControlLabel value="HostPath" control={<Radio />} label="HostPath" />
                <FormControlLabel value="ConfigMap" control={<Radio />} label="ConfigMap" />
                <FormControlLabel value="Secret" control={<Radio />} label="Secret" />
              </RadioGroup>
            }
            label="Type"
          />

          {/* Conditional rendering for different types */}
          {volume.type === 'HostPath' && (
            <>
              <TextField
                label="Host Path"
                required
                fullWidth
                margin="normal"
                placeholder="Please enter"
                onChange={(e) => handleVolumeDataChange(volume.id, 'hostPath', e.target.value)}
                error={!volume.data.hostPath}
                helperText={!volume.data.hostPath ? 'Missing path' : ''}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>External IPs</InputLabel>
                <Select
                  value={volume.data.externalIP || ''}
                  onChange={(e) => handleVolumeDataChange(volume.id, 'externalIP', e.target.value)}
                >
                  <MenuItem value="">Please select</MenuItem>
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
                value={volume.data.configMap || ''}
                onChange={(e) => handleVolumeDataChange(volume.id, 'configMap', e.target.value)}
                error={!volume.data.configMap}
                // helperText={!volume.data.configMap ? 'Missing ConfigMap' : ''}
              >
                <MenuItem value="">Please select</MenuItem>
                {/* Add ConfigMap options here */}
              </Select>
            </FormControl>
          )}
          {volume.type === 'Secret' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Secret Name</InputLabel>
              <Select
                value={volume.data.secretName || ''}
                onChange={(e) => handleVolumeDataChange(volume.id, 'secretName', e.target.value)}
                error={!volume.data.secretName}
                // helperText={!volume.data.secretName ? 'Missing SecretName' : ''}
              >
                <MenuItem value="">Please select</MenuItem>
                {/* Add Secret options here */}
              </Select>
            </FormControl>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleVolumeDataChange(volume.id, 'keyToPath', [...(volume.data.keyToPath || []), { key: '', value: '' }])}
              fullWidth
            >
              + Add KeyToPath
            </Button>
            {(volume.data.keyToPath || []).map((keyValue: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  label="Key"
                  required
                  value={keyValue.key}
                  onChange={(e) => {
                    const newKeyToPath = [...(volume.data.keyToPath || [])];
                    newKeyToPath[index].key = e.target.value;
                    handleVolumeDataChange(volume.id, 'keyToPath', newKeyToPath);
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
                    const newKeyToPath = [...(volume.data.keyToPath || [])];
                    newKeyToPath[index].value = e.target.value;
                    handleVolumeDataChange(volume.id, 'keyToPath', newKeyToPath);
                  }}
                  margin="normal"
                  placeholder="Please input value"
                  error={!keyValue.value}
                  helperText={!keyValue.value ? 'Missing value' : ''}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const newKeyToPath = (volume.data.keyToPath || []).filter((_: any, i: number) => i !== index);
                    handleVolumeDataChange(volume.id, 'keyToPath', newKeyToPath);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => handleVolumeDataChange(volume.id, 'mountContainer', [...(volume.data.mountContainer || []), { container: '', mountPath: '' }])}
              fullWidth
            >
              + Add Mount Container
            </Button>
            {(volume.data.mountContainer || []).map((mount: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Container</InputLabel>
                  <Select
                    value={mount.container}
                    onChange={(e) => {
                      const newMountContainer = [...(volume.data.mountContainer || [])];
                      newMountContainer[index].container = e.target.value;
                      handleVolumeDataChange(volume.id, 'mountContainer', newMountContainer);
                    }}
                    error={!mount.container}
                    // helperText={!mount.container ? 'Missing container' : ''}
                  >
                    <MenuItem value="">Please select</MenuItem>
                    {/* Add Container options here */}
                  </Select>
                </FormControl>
                <TextField
                  label="Mount Path"
                  required
                  value={mount.mountPath}
                  onChange={(e) => {
                    const newMountContainer = [...(volume.data.mountContainer || [])];
                    newMountContainer[index].mountPath = e.target.value;
                    handleVolumeDataChange(volume.id, 'mountContainer', newMountContainer);
                  }}
                  margin="normal"
                  placeholder="Please input mountPath"
                  error={!mount.mountPath}
                  helperText={!mount.mountPath ? 'Missing mountPath' : ''}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const newMountContainer = (volume.data.mountContainer || []).filter((_: any, i: number) => i !== index);
                    handleVolumeDataChange(volume.id, 'mountContainer', newMountContainer);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </FormControl>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddVolume}
        fullWidth
      >
        Add Volume
      </Button>
      {volumes.map(renderVolumeForm)}
    </Box>
  );
}
