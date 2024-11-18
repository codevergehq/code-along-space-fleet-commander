import { useState, useEffect } from 'react'

const getConditionText = (conditionPercent) => {
    if (conditionPercent >= 90) return { text: 'Excellent', color: 'text-green-400' }
    if (conditionPercent >= 75) return { text: 'Good', color: 'text-green-300' }
    if (conditionPercent >= 50) return { text: 'Fair', color: 'text-yellow-400' }
    if (conditionPercent >= 25) return { text: 'Poor', color: 'text-orange-400' }
    return { text: 'Critical', color: 'text-red-400' }
}

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


function FleetManagement({ fleet, setFleet, addAlert }) {
    const updateShipStatus = (shipId, newStatus) => {
        const ship = fleet.find(s => s.id === shipId)

        if (ship.status === 'mission') {
            addAlert("Cannot update status of ship on active mission", 'error')
            return
        }

        if (newStatus === 'maintenance') {
            // Start maintenance
            setFleet(prev => prev.map(s =>
                s.id === shipId
                    ? {
                        ...s,
                        status: 'maintenance',
                        maintenanceProgress: 0
                    }
                    : s
            ))
            addAlert(`${ship.name} entered maintenance bay`, 'info')
        } else if (newStatus === 'maintenance-complete') {
            // Maintenance completed
            setFleet(prev => prev.map(s =>
                s.id === shipId
                    ? {
                        ...s,
                        status: 'docked',
                        fuelLevel: 100,
                        condition: 100,
                        maintenanceProgress: 0
                    }
                    : s
            ))
            addAlert(`${ship.name} maintenance complete - All systems restored`, 'success')
        } else {
            setFleet(prev => prev.map(s =>
                s.id === shipId ? { ...s, status: newStatus } : s
            ))
            addAlert(`Ship status updated: ${newStatus}`, 'info')
        }
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Fleet Management</h2>
            {fleet.map(ship => (
                <ShipCard
                    key={ship.id}
                    ship={ship}
                    onStatusUpdate={updateShipStatus}
                />
            ))}
        </div>
    )
}


export default FleetManagement