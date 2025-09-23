
import { useContext } from 'react';
import { AppContext } from '@/components/Common/AppContext';

export const useAlert = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAlert must be used within a AppProvider');
  }

  return {
    success: context.setSuccessMessage,
    error: context.setErrorMessage,
  };
};
