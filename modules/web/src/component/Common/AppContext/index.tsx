'use client';

import { useStorage } from "@/hook/useStorage";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import { createContext, useState } from "react";

export const AppContext = createContext<{
  namespace: string;
  setNamespace: (value: any) => void;
  setErrorMessage: (value: string) => void;
  setSuccessMessage: (value: string) => void;
} | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [ namespace, setNamespace ] = useStorage('namespace');
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');


  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessageState] = useState('');

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSuccessClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') return;
    setSuccessOpen(false);
  };

  const setErrorMessage = (message: string) => {
    setAlertMessage(message);
    setOpen(true);
  }

  const setSuccessMessage = (message: string) => {
    setSuccessMessageState(message);
    setSuccessOpen(true);
  };

 return (
    <AppContext.Provider
      value={{ namespace, setNamespace, setErrorMessage, setSuccessMessage }}
    >
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={successOpen} autoHideDuration={4000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};
