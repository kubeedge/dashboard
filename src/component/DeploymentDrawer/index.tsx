import React, { useState } from 'react';
import { Drawer, Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import BasicInfoForm from './DeploymentForms/BasicInfoForm';
import ContainerInfoForm from './DeploymentForms/ContainerInfoForm';
import StorageMountForm from './DeploymentForms/StorageMountForm';
import MoreSettingForm from './DeploymentForms/MoreSettingForm';
import { Deployment } from '@/types/deployment';
import { useAlert } from '@/hook/useAlert';

const steps = ['Basic Info', 'Container Info', 'Storage Mount', 'More Setting'];

interface DeploymentDrawerProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: Deployment) => void;
}

export default function DeploymentDrawer({ open, onClose, onSubmit }: DeploymentDrawerProps) {
  const [activeStep, setActiveStep] = useState(0);
  const { setErrorMessage } = useAlert();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      await onSubmit?.(event, {} as Deployment);
      handleClose(event);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Failed to create Deployment');
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleReset();
    onClose?.();
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoForm />;
      case 1:
        return <ContainerInfoForm />;
      case 2:
        return <StorageMountForm />;
      case 3:
        return <MoreSettingForm />;
      default:
        return null;
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} sx={{
      '& .MuiDrawer-paper': {
        width: '70%',
        maxWidth: '70%',
        top: '50px', // Distance from top
        height: 'calc(100% - 50px)', // Adjust height to fit within the viewport
        borderTopLeftRadius: '6px',
        borderBottomLeftRadius: '6px',
        padding: '20px',
      },
    }}>
      <Box sx={{ padding: '24px', width: '70vw', boxSizing: 'border-box' }}>
        <Box sx={{ marginBottom: '24px' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          {activeStep === 0 ? (
            <Button onClick={onClose}>Cancel</Button>
          ) : (
            <Button onClick={handleBack}>Previous</Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={handleFormSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
