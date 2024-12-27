import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (username, message) => {
    setAlert({ username, message });
    setTimeout(() => setAlert(null), 3000); // Auto-close after 3 seconds
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
