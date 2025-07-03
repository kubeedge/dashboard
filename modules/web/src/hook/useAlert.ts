import { useContext } from 'react';
import { AppContext } from '@/component/AppContext'

export const useAlert = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAlert must be used within a AppProvider');
  }
  return { setErrorMessage: context.setErrorMessage };
}
