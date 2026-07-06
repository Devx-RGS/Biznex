import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = useCallback((title, message, buttons) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons: buttons || [],
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};
