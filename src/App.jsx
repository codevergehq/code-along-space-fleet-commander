import { useState } from 'react'

import FleetManagement from './components/fleet/FleetManagement'
import CrewManagement from './components/crew/CrewManagement'
import MissionControl from './components/missions/MissionControl'
import AlertSystem from './components/ui/AlertSystem'
import { FleetProvider } from './contexts/FleetContext'
import { SystemProvider } from './contexts/SystemContext'

const INITIAL_CREW = [
  { id: 1, name: "Cmdr. Sarah Chen", rank: "Commander", specialty: "Navigation", status: "available" },
  { id: 2, name: "Lt. James Wilson", rank: "Lieutenant", specialty: "Engineering", status: "available" },
  { id: 3, name: "Dr. Maya Patel", rank: "Science Officer", specialty: "Xenobiology", status: "available" }
]

const INITIAL_MISSIONS = []

function App() {
  const [crew, setCrew] = useState(INITIAL_CREW)
  const [missions, setMissions] = useState(INITIAL_MISSIONS)

  return (
    <SystemProvider>
      <FleetProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <header className="bg-gray-800 p-4">
            <h1 className="text-2xl font-bold">Space Fleet Commander</h1>
          </header>

          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FleetManagement/>
              <CrewManagement
                crew={crew}
                setCrew={setCrew}
              />
              <MissionControl
                missions={missions}
                setMissions={setMissions}
                crew={crew}
                setCrew={setCrew}
              />
            </div>

            <AlertSystem />
          </div>
        </div>
      </FleetProvider>
    </SystemProvider>
  )
}

export default App
