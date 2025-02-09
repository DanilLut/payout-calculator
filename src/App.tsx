import './App.css'

import { ThemeProvider } from '@/components/ThemeProvider'
import { Dashboard } from '@/components/Dashboard'

import { ProjectDataProvider } from '@/contexts/ProjectDataContext'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <div className="p-4">
                    <ProjectDataProvider>
                        <Dashboard />
                    </ProjectDataProvider>
                </div>
            </ThemeProvider>
        </>
    )
}

export default App
