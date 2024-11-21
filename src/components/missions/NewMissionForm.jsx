import { useState } from 'react'
import { getConditionText } from '../../utils/getConditionText'
import { useSystem } from '../../contexts/SystemContext'
import { useFleet } from '../../contexts/FleetContext'

function NewMissionForm({
  crew,
  setCrew,
  setMissions,
  onComplete
}) {
  const { fleet, getAvailableShips, updateShipStatus } = useFleet()
  const { addAlert } = useSystem()

  const [missionData, setMissionData] = useState({
    name: '',
    priority: 'medium',
    assignedShip: '',
    assignedCrew: [],
  })

  const availableShips = getAvailableShips()

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

    if (missionData.assignedCrew.length === 0) {
      addAlert('Please assign at least one crew member', 'error')
      return
    }

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

    setMissions(prev => [...prev, newMission])
    updateShipStatus(parseInt(missionData.assignedShip), 'mission')
    setCrew(prev => prev.map(member =>
      missionData.assignedCrew.includes(member.id)
        ? { ...member, status: 'on-mission' }
        : member
    ))

    addAlert('New mission created successfully!', 'success')
    onComplete()
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <MissionFormInputs
          missionData={missionData}
          setMissionData={setMissionData}
          availableShips={availableShips}
          availableCrew={availableCrew}
        />

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

function MissionFormInputs({ missionData, setMissionData, availableShips, availableCrew }) {
  return (
    <>
      <TextInput
        label="Mission Name"
        value={missionData.name}
        onChange={(value) => setMissionData(prev => ({
          ...prev,
          name: value
        }))}
        placeholder="Enter mission name"
      />

      <SelectInput
        label="Priority Level"
        value={missionData.priority}
        onChange={(value) => setMissionData(prev => ({
          ...prev,
          priority: value
        }))}
        options={[
          { value: 'low', label: 'Low Priority' },
          { value: 'medium', label: 'Medium Priority' },
          { value: 'high', label: 'High Priority' }
        ]}
      />

      <ShipSelector
        selectedShip={missionData.assignedShip}
        availableShips={availableShips}
        onShipSelect={(shipId) => setMissionData(prev => ({
          ...prev,
          assignedShip: shipId
        }))}
      />

      <CrewSelector
        selectedCrew={missionData.assignedCrew}
        availableCrew={availableCrew}
        onCrewChange={(crewIds) => setMissionData(prev => ({
          ...prev,
          assignedCrew: crewIds
        }))}
      />
    </>
  )
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  )
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="bg-gray-700">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function ShipSelector({ selectedShip, availableShips, onShipSelect }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Assign Ship
      </label>
      <select
        value={selectedShip}
        onChange={(e) => onShipSelect(e.target.value)}
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
  )
}

function CrewSelector({ selectedCrew, availableCrew, onCrewChange }) {
  return (
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
                checked={selectedCrew.includes(member.id)}
                onChange={(e) => {
                  const newSelectedCrew = e.target.checked
                    ? [...selectedCrew, member.id]
                    : selectedCrew.filter(id => id !== member.id)
                  onCrewChange(newSelectedCrew)
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
  )
}

export default NewMissionForm
