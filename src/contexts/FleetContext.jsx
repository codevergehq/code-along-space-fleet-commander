import React from 'react'

const INITIAL_FLEET = [
  { id: 1, name: "Stellar Voyager", status: "docked", fuelLevel: 100, condition: 100, maintenanceProgress: 0 },
  { id: 2, name: "Nova Explorer", status: "docked", fuelLevel: 85, condition: 90, maintenanceProgress: 0 },
  { id: 3, name: "Cosmic Pioneer", status: "docked", fuelLevel: 35, condition: 40, maintenanceProgress: 0 }
]

const FleetContext = React.createContext();

export function useFleet() {
  const context = React.useContext(FleetContext);

  if (!context) {
    throw new Error("useFleet must be used within a FleetProvider")
  }

  return context
}

export function FleetProvider({ children }) {
  const [fleet, setFleet] = React.useState(INITIAL_FLEET)

  const getShipById = (shipId) => {
    return fleet.find(ship => ship.id === shipId)
  }

  const updateShipStatus = (shipId, newStatus) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId ? { ...ship, status: newStatus } : ship
    ))
  }

  const startMaintenance = (shipId) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId
        ? {
          ...ship,
          status: 'maintenance',
          maintenanceProgress: 0
        }
        : ship
    ))
  }

  const updateMaintenanceProgress = (shipId, progress) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId ? { ...ship, maintenanceProgress: progress } : ship
    ))
  }

  const completeMaintenance = (shipId) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId
        ? {
          ...ship,
          status: 'docked',
          fuelLevel: 100,
          condition: 100,
          maintenanceProgress: 0
        }
        : ship
    ))
  }

  const updateShipFuel = (shipId, fuelConsumption) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId
        ? {
          ...ship,
          fuelLevel: Math.max(0, ship.fuelLevel - fuelConsumption)
        }
        : ship
    ))
  }

  const updateShipCondition = (shipId, conditionChange) => {
    setFleet(prev => prev.map(ship =>
      ship.id === shipId
        ? {
          ...ship,
          condition: Math.max(0, Math.min(100, ship.condition + conditionChange))
        }
        : ship
    ))
  }

  const getAvailableShips = () => {
    return fleet.filter(ship =>
      ship.status === 'docked' &&
      ship.fuelLevel >= 25 &&
      ship.condition >= 30
    )
  }

  const value = {
    fleet,
    getShipById,
    updateShipStatus,
    startMaintenance,
    updateMaintenanceProgress,
    completeMaintenance,
    updateShipFuel,
    updateShipCondition,
    getAvailableShips
  }

  return (
    <FleetContext.Provider value={value}>
      {children}
    </FleetContext.Provider>
  );
};
