import React from 'react'
import { getConditionText } from '../../utils/getConditionText'
import { useFleet } from '../../contexts/FleetContext'

function ShipCard({ shipId, onStatusUpdate }) {
	const {
		getShipById,
    updateShipStatus,
    startMaintenance,
    completeMaintenance,
    updateMaintenanceProgress
	} = useFleet()

	const ship = getShipById(shipId)

	if(!ship) return null

	const condition = getConditionText(ship.condition)
  const isOnMission = ship.status === 'mission'
  const isInMaintenance = ship.status === 'maintenance'

  const handleStatusChange = (e) => {
    if (e.target.value === 'maintenance') {
      startMaintenance(ship.id);
    }
    updateShipStatus(ship.id, e.target.value);
  }

	// Maintenance progress effect
  React.useEffect(() => {
    let maintenanceInterval = null

    if (isInMaintenance) {
      maintenanceInterval = setInterval(() => {
        if (ship.maintenanceProgress >= 100) {
          completeMaintenance(ship.id)
          onStatusUpdate(ship.id, 'maintenance-complete')
        } else {
          updateMaintenanceProgress(ship.id, ship.maintenanceProgress + 1)
        }
      }, 300) // Complete maintenance in 30 seconds (300ms * 100)
    }

    return () => {
      if (maintenanceInterval) clearInterval(maintenanceInterval)
    }
  }, [isInMaintenance, ship.id, ship.maintenanceProgress])

	return (
    <div className="bg-gray-700 p-3 rounded-md mb-2">
      <h3 className="font-semibold">{ship.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div className={`${isOnMission ? 'text-yellow-400' : isInMaintenance ? 'text-blue-400' : 'text-white'}`}>
          Status: {ship.status}
        </div>
        <div className={getFuelColor(ship.fuelLevel)}>
          Fuel: {ship.fuelLevel}%
        </div>
        <div className={condition.color}>
          Condition: {condition.text}
        </div>
        <select
          className={`bg-gray-600 rounded ${(isOnMission || isInMaintenance) ? 'opacity-50 cursor-not-allowed' : ''}`}
          value={ship.status}
          onChange={handleStatusChange}
          disabled={isOnMission || isInMaintenance}
        >
          <option value="docked">Docked</option>
          <option value="maintenance">Maintenance</option>
          {isOnMission && <option value="mission">On Mission</option>}
        </select>
      </div>

      {isInMaintenance && <MaintenanceProgress progress={ship.maintenanceProgress} />}
    </div>
  )
}

function MaintenanceProgress({ progress }) {
  return (
    <div className="mt-3">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-blue-400">
              Maintenance Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-600">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-100"
          />
        </div>
      </div>
    </div>
  )
}

function getFuelColor(fuel) {
  if (fuel >= 60) return 'text-green-400'
  if (fuel >= 25) return 'text-yellow-400'
  return 'text-red-400'
}

export default ShipCard
