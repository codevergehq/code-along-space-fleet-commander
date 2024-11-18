import { useState, useEffect } from 'react'

import Modal from '../ui/Modal'

const getConditionText = (conditionPercent) => {
    if (conditionPercent >= 90) return { text: 'Excellent', color: 'text-green-400' }
    if (conditionPercent >= 75) return { text: 'Good', color: 'text-green-300' }
    if (conditionPercent >= 50) return { text: 'Fair', color: 'text-yellow-400' }
    if (conditionPercent >= 25) return { text: 'Poor', color: 'text-orange-400' }
    return { text: 'Critical', color: 'text-red-400' }
}

function NewMissionForm({ 
    fleet, 
    setFleet, 
    crew, 
    setCrew, 
    missions, 
    setMissions, 
    addAlert,
    onComplete 
  }) {
    const [missionData, setMissionData] = useState({
      name: '',
      priority: 'medium',
      assignedShip: '',
      assignedCrew: [],
    })
  
    // Filter available ships - must be docked, with sufficient fuel and condition
    const availableShips = fleet.filter(ship => 
      ship.status === 'docked' && 
      ship.fuelLevel >= 25 &&
      ship.condition >= 30
    )
  
    // Filter available crew members
    const availableCrew = crew.filter(member => 
      member.status === 'available'
    )
  
    const handleSubmit = (e) => {
      e.preventDefault()
      
      // Validations
      if (!missionData.name.trim()) {
        addAlert('Mission name is required', 'error')
        return
      }
  
      if (!missionData.assignedShip) {
        addAlert('Please assign a ship', 'error')
        return
      }
  
      // Check ship fuel and condition
      const selectedShip = fleet.find(ship => ship.id === parseInt(missionData.assignedShip))
      if (selectedShip.fuelLevel < 25) {
        addAlert('Ship fuel level too low for mission', 'error')
        return
      }
  
      if (selectedShip.condition < 30) {
        addAlert('Ship condition too poor for mission', 'error')
        return
      }
  
      if (missionData.assignedCrew.length === 0) {
        addAlert('Please assign at least one crew member', 'error')
        return
      }
  
      // Create new mission
      const newMission = {
        id: Date.now(),
        name: missionData.name,
        status: 'in-progress',
        assignedShip: parseInt(missionData.assignedShip),
        assignedCrew: missionData.assignedCrew.map(id => parseInt(id)),
        priority: missionData.priority,
        startTime: Date.now(),
        progress: 0
      }
  
      // Update missions
      setMissions(prev => [...prev, newMission])
  
      // Update ship status
      setFleet(prev => prev.map(ship => 
        ship.id === parseInt(missionData.assignedShip)
          ? { ...ship, status: 'mission' }
          : ship
      ))
  
      // Update crew status
      setCrew(prev => prev.map(member => 
        missionData.assignedCrew.includes(member.id)
          ? { ...member, status: 'on-mission' }
          : member
      ))
  
      addAlert('New mission created successfully!', 'success')
      onComplete() // Close the modal
    }
  
    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mission Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mission Name
            </label>
            <input
              type="text"
              value={missionData.name}
              onChange={(e) => setMissionData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter mission name"
            />
          </div>
  
          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Priority Level
            </label>
            <select
              value={missionData.priority}
              onChange={(e) => setMissionData(prev => ({
                ...prev,
                priority: e.target.value
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low" className="bg-gray-700">Low Priority</option>
              <option value="medium" className="bg-gray-700">Medium Priority</option>
              <option value="high" className="bg-gray-700">High Priority</option>
            </select>
          </div>
  
          {/* Ship Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign Ship
            </label>
            <select
              value={missionData.assignedShip}
              onChange={(e) => setMissionData(prev => ({
                ...prev,
                assignedShip: e.target.value
              }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-700">Select a ship</option>
              {availableShips.map(ship => {
                const condition = getConditionText(ship.condition)
                return (
                  <option 
                    key={ship.id} 
                    value={ship.id}
                    className="bg-gray-700"
                  >
                    {ship.name} - Fuel: {ship.fuelLevel}% - {condition.text}
                  </option>
                )
              })}
            </select>
            {availableShips.length === 0 && (
              <p className="mt-1 text-sm text-yellow-500">
                No ships currently available for mission
              </p>
            )}
          </div>
  
          {/* Crew Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Assign Crew Members
            </label>
            {availableCrew.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-700 border border-gray-600 rounded-md p-2">
                {availableCrew.map(member => (
                  <label 
                    key={member.id} 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-600 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={missionData.assignedCrew.includes(member.id)}
                      onChange={(e) => {
                        setMissionData(prev => ({
                          ...prev,
                          assignedCrew: e.target.checked
                            ? [...prev.assignedCrew, member.id]
                            : prev.assignedCrew.filter(id => id !== member.id)
                        }))
                      }}
                      className="form-checkbox h-4 w-4 text-blue-500 bg-gray-600 border-gray-500 rounded"
                    />
                    <div>
                      <span className="text-white">{member.name}</span>
                      <span className="text-gray-400 text-sm ml-2">
                        {member.rank}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({member.specialty})
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yellow-500">
                No crew members currently available for mission
              </p>
            )}
          </div>
  
          {/* Mission Requirements Notice */}
          <div className="bg-gray-700 border border-gray-600 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">
              Mission Requirements:
            </h4>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Ship must have at least 25% fuel</li>
              <li>Ship must be in Fair condition or better</li>
              <li>At least one crew member must be assigned</li>
            </ul>
          </div>
  
          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onComplete}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-150
                ${availableShips.length > 0 && availableCrew.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-500 cursor-not-allowed text-gray-300'}`}
              disabled={availableShips.length === 0 || availableCrew.length === 0}
            >
              Create Mission
            </button>
          </div>
        </form>
      </div>
    )
  }
  

function MissionCard({ mission, fleet, crew, onMissionComplete }) {
    const [progress, setProgress] = useState(mission.progress || 0)
    const duration = 60 * 1000 // 60 seconds in milliseconds

    useEffect(() => {
        if (mission.status !== 'in-progress') return

        const startTime = mission.startTime
        const updateInterval = 100 // Update every 100ms for smooth progress

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const currentProgress = Math.min((elapsed / duration) * 100, 100)
            setProgress(currentProgress)

            if (currentProgress >= 100) {
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

// Update MissionControl.jsx
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