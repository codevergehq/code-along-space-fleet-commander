import { useState, useEffect } from 'react'

const getConditionText = (conditionPercent) => {
    if (conditionPercent >= 90) return { text: 'Excellent', color: 'text-green-400' }
    if (conditionPercent >= 75) return { text: 'Good', color: 'text-green-300' }
    if (conditionPercent >= 50) return { text: 'Fair', color: 'text-yellow-400' }
    if (conditionPercent >= 25) return { text: 'Poor', color: 'text-orange-400' }
    return { text: 'Critical', color: 'text-red-400' }
}

function NewMissionForm({ fleet, crew, missions, setMissions, setFleet, setCrew, addAlert }) {
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

        // Reset form
        setMissionData({
            name: '',
            priority: 'medium',
            assignedShip: '',
            assignedCrew: [],
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-4">Create New Mission</h3>

            <div className="space-y-4">
                {/* Mission Name */}
                <div>
                    <label className="block text-sm mb-1">Mission Name</label>
                    <input
                        type="text"
                        value={missionData.name}
                        onChange={(e) => setMissionData(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        className="w-full bg-gray-600 rounded p-2 text-white"
                        placeholder="Enter mission name"
                    />
                </div>

                {/* Priority Selection */}
                <div>
                    <label className="block text-sm mb-1">Priority</label>
                    <select
                        value={missionData.priority}
                        onChange={(e) => setMissionData(prev => ({
                            ...prev,
                            priority: e.target.value
                        }))}
                        className="w-full bg-gray-600 rounded p-2"
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                </div>

                {/* Ship Selection */}
                <div>
                    <label className="block text-sm mb-1">Assign Ship</label>
                    <select
                        value={missionData.assignedShip}
                        onChange={(e) => setMissionData(prev => ({
                            ...prev,
                            assignedShip: e.target.value
                        }))}
                        className="w-full bg-gray-600 rounded p-2"
                    >
                        <option value="">Select a ship</option>
                        {availableShips.map(ship => {
                            const condition = getConditionText(ship.condition)
                            return (
                                <option
                                    key={ship.id}
                                    value={ship.id}
                                    className={condition.color}
                                >
                                    {ship.name} - Fuel: {ship.fuelLevel}% - {condition.text}
                                </option>
                            )
                        })}
                    </select>
                    {availableShips.length === 0 && (
                        <p className="text-yellow-400 text-sm mt-1">
                            No ships currently available for mission
                        </p>
                    )}
                </div>

                {/* Crew Selection */}
                <div>
                    <label className="block text-sm mb-1">Assign Crew</label>
                    {availableCrew.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-600 rounded p-2">
                            {availableCrew.map(member => (
                                <label key={member.id} className="flex items-center space-x-2 hover:bg-gray-500 p-1 rounded">
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
                                        className="form-checkbox bg-gray-600 rounded"
                                    />
                                    <span>
                                        {member.name} - {member.rank}
                                        <span className="text-gray-300 text-sm ml-2">
                                            ({member.specialty})
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-yellow-400 text-sm">
                            No crew members currently available for mission
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded font-semibold transition-colors
              ${availableShips.length > 0 && availableCrew.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-500 cursor-not-allowed text-gray-300'}`}
                    disabled={availableShips.length === 0 || availableCrew.length === 0}
                >
                    Create Mission
                </button>

                {/* Mission Requirements Notice */}
                <div className="text-sm text-gray-400 mt-2">
                    <p>Mission Requirements:</p>
                    <ul className="list-disc list-inside">
                        <li>Ship must have at least 25% fuel</li>
                        <li>Ship must be in Fair condition or better</li>
                        <li>At least one crew member must be assigned</li>
                    </ul>
                </div>
            </div>
        </form>
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
            <h2 className="text-xl font-bold mb-4">Mission Control</h2>

            <NewMissionForm
                fleet={fleet}
                setFleet={setFleet}
                crew={crew}
                setCrew={setCrew}
                missions={missions}
                setMissions={setMissions}
                addAlert={addAlert}
            />

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
            </div>
        </div>
    )
}


export default MissionControl