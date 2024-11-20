import React from 'react';

const SystemContext = React.createContext();

export function useSystem() {
	const context = React.useContext(SystemContext);

	if(!context) {
		throw new Error("useSystem must be used within a SystemProvider")
	}

	return context
}

export function SystemProvider({ children }) {
	const [alerts, setAlerts] = React.useState([])

  const addAlert = (message, type = 'info') => {
    const newAlert = { id: Date.now(), message, type }
    setAlerts(prev => [...prev, newAlert])
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
    }, 5000)
  }

  const value = {
    alerts,
    addAlert
  }

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
