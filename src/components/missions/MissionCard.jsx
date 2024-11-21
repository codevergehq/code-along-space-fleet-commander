import { useState, useEffect } from 'react'
import { getConditionText } from '../../utils/getConditionText'
import { useFleet } from '../../contexts/FleetContext'

function MissionCard({ mission, crew, onMissionComplete }) {
  const { fleet } = useFleet()
  const [progress, setProgress] = useState(mission.progress || 0)
  const duration = 60 * 1000 // 60 seconds in milliseconds

  useEffect(() => {
    if (mission.status !== 'in-progress') return

    const startTime = mission.startTime
    const updateInterval = 10 // Update every 100ms for smooth progress

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(currentProgress)

      if (currentProgress >= 1) {
        clearInterval(timer)
        // 70% chance of success
        const success = Math.random() < 0.7
        onMissionComplete(mission.id, success)
      }
    }, updateInterval)

    return () => clearInterval(timer)
  }, [mission.id, mission.startTime, mission.status])

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'text-yellow-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-white'
    }
  }

  const assignedShip = fleet.find(ship => ship.id === mission.assignedShip)
  const shipCondition = assignedShip ? getConditionText(assignedShip.condition) : null

  return (
    <div className="bg-gray-700 p-3 rounded-md mb-2">
      <h3 className="font-semibold">{mission.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div className={getStatusColor(mission.status)}>
          Status: {mission.status}
        </div>
        <div>Priority: {mission.priority}</div>
        <div>
          Assigned Ship: {assignedShip?.name || 'None'}
          {assignedShip && (
            <span className={`ml-2 ${shipCondition.color}`}>
              ({shipCondition.text})
            </span>
          )}
        </div>
        <div>
          Crew: {
            mission.assignedCrew
              .map(id => crew.find(c => c.id === id)?.name)
              .join(', ') || 'None'
          }
        </div>
      </div>

      {mission.status === 'in-progress' && (
        <div className="mt-3">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-blue-400">
                  Mission Progress
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

export default MissionCard
