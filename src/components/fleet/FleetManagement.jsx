import ShipCard from './ShipCard'

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