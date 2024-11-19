import { useState, useEffect } from 'react'
import { getConditionText } from '../../utils/getConditionText'

function ShipCard({ ship, onStatusUpdate }) {
  const [progress, setProgress] = useState(ship.maintenanceProgress || 0)
  const isOnMission = ship.status === 'mission'
  const isInMaintenance = ship.status === 'maintenance'
  const condition = getConditionText(ship.condition)

  // Maintenance progress effect
  useEffect(() => {
    if (!isInMaintenance) return

    const maintenanceInterval = setInterval(() => {
      setProgress(currentProgress => {
        if (currentProgress >= 100) {
          clearInterval(maintenanceInterval)
          onStatusUpdate(ship.id, 'maintenance-complete')
          return 100
        }
        return currentProgress + 1
      })
    }, 300) // Complete maintenance in 30 seconds (300ms * 100)

    return () => clearInterval(maintenanceInterval)
  }, [isInMaintenance, ship.id])

  const getFuelColor = (fuel) => {
    if (fuel >= 60) return 'text-green-400'
    if (fuel >= 25) return 'text-yellow-400'
    return 'text-red-400'
  }

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
          onChange={(e) => onStatusUpdate(ship.id, e.target.value)}
          disabled={isOnMission || isInMaintenance}
        >
          <option value="docked">Docked</option>
          <option value="maintenance">Maintenance</option>
          {isOnMission && <option value="mission">On Mission</option>}
        </select>
      </div>

      {isInMaintenance && (
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
      )}
    </div>
  )
}

export default ShipCard
