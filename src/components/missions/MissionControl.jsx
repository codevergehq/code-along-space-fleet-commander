import { useState } from 'react'

import MissionCard from './MissionCard'
import NewMissionForm from './NewMissionForm'
import Modal from '../ui/Modal'

function MissionControl({ missions, setMissions, fleet, setFleet, crew, setCrew, addAlert }) {
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false)

  const handleMissionComplete = (missionId, success) => {
      // Update mission status
      setMissions(prev => prev.map(mission =>
          mission.id === missionId
              ? { ...mission, status: success ? 'completed' : 'failed' }
              : mission
      ))

      // Find the mission to get assigned resources
      const mission = missions.find(m => m.id === missionId)
      if (!mission) return

      // Update ship fuel and condition
      setFleet(prev => prev.map(ship => {
          if (ship.id === mission.assignedShip) {
              // Calculate fuel consumption (20-40%)
              const fuelConsumption = Math.floor(Math.random() * 21) + 20
              const newFuelLevel = Math.max(0, ship.fuelLevel - fuelConsumption)

              // Calculate condition damage if mission failed
              let newCondition = ship.condition
              if (!success) {
                  const conditionDamage = Math.floor(Math.random() * 16) + 15 // 15-30% damage on failure
                  newCondition = Math.max(0, ship.condition - conditionDamage)
              }

              // Determine new status
              let newStatus = 'docked'
              if (newFuelLevel === 0 || newCondition < 30) {
                  newStatus = 'maintenance'
                  addAlert(`${ship.name} requires maintenance!`, 'warning')
              }

              return {
                  ...ship,
                  status: newStatus,
                  fuelLevel: newFuelLevel,
                  condition: newCondition
              }
          }
          return ship
      }))

      // Free up the crew
      setCrew(prev => prev.map(member =>
          mission.assignedCrew.includes(member.id)
              ? { ...member, status: 'available' }
              : member
      ))

      // Show completion alert
      addAlert(
          `Mission ${mission.name} ${success ? 'completed successfully!' : 'failed!'}`,
          success ? 'success' : 'error'
      )
  }

  return (
      <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Mission Control</h2>
              <button
                  onClick={() => setIsNewMissionModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2"
              >
                  <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                      />
                  </svg>
                  <span>New Mission</span>
              </button>
          </div>

          <div className="space-y-2">
              {missions.map(mission => (
                  <MissionCard
                      key={mission.id}
                      mission={mission}
                      fleet={fleet}
                      crew={crew}
                      onMissionComplete={handleMissionComplete}
                  />
              ))}
              {missions.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                      No active missions. Create a new mission to get started.
                  </p>
              )}
          </div>

          <Modal
              isOpen={isNewMissionModalOpen}
              onClose={() => setIsNewMissionModalOpen(false)}
          >
              <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Create New Mission</h3>
                  <NewMissionForm
                      fleet={fleet}
                      setFleet={setFleet}
                      crew={crew}
                      setCrew={setCrew}
                      missions={missions}
                      setMissions={setMissions}
                      addAlert={addAlert}
                      onComplete={() => setIsNewMissionModalOpen(false)}
                  />
              </div>
          </Modal>
      </div>
    )
}

export default MissionControl
