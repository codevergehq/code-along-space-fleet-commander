import CrewCard from './CrewCard'
import { useSystem } from '../../contexts/SystemContext'

function CrewManagement({ crew, setCrew }) {
  const { addAlert } = useSystem()

  const updateCrewStatus = (crewId, newStatus) => {
    const member = crew.find(m => m.id === crewId)
    if (member.status === 'on-mission') {
      addAlert("Cannot update status of crew member on active mission", 'error')
      return
    }

    setCrew(prev => prev.map(member =>
      member.id === crewId ? { ...member, status: newStatus } : member
    ))
    addAlert(`Crew member status updated: ${newStatus}`, 'info')
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Crew Management</h2>
      {crew.map(member => (
        <CrewCard
          key={member.id}
          member={member}
          onStatusUpdate={updateCrewStatus}
        />
      ))}
    </div>
  )
}

export default CrewManagement
