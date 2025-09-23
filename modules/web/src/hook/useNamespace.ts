import { useContext } from 'react';
import { AppContext } from '@/components/Common/AppContext'

export const useNamespace = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNamespace must be used within a AppProvider');
  }
  return context;
}
