import { useContext } from 'react';
import { AppContext } from '@/component/AppContext'

export const useNamespace = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useNamespace must be used within a AppProvider');
  }
  return context;
}
