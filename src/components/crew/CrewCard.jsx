function CrewCard({ member, onStatusUpdate }) {
  const isOnMission = member.status === 'on-mission'

  return (
    <div className="bg-gray-700 p-3 rounded-md mb-2">
      <h3 className="font-semibold">{member.name}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
        <div>Rank: {member.rank}</div>
        <div>Specialty: {member.specialty}</div>
        <div className={`${isOnMission ? 'text-yellow-400' : 'text-white'}`}>
          Status: {member.status}
        </div>
        <select
          className={`bg-gray-600 rounded ${isOnMission ? 'opacity-50 cursor-not-allowed' : ''}`}
          value={member.status}
          onChange={(e) => onStatusUpdate(member.id, e.target.value)}
          disabled={isOnMission}
        >
          <option value="available">Available</option>
          <option value="off-duty">Off Duty</option>
          {isOnMission && <option value="on-mission">On Mission</option>}
        </select>
      </div>
    </div>
  )
}

export default CrewCard
