import ShipCard from './ShipCard'
import { useFleet } from '../../contexts/FleetContext'

function FleetManagement() {
  const { fleet } = useFleet()

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Fleet Management</h2>
      {fleet.map(ship => (
        <ShipCard
          key={ship.id}
          shipId={ship.id}
        />
      ))}
    </div>
  )
}

export default FleetManagement
