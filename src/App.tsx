import './App.css'

import { ThemeProvider } from '@/components/ThemeProvider'
import { Dashboard } from '@/components/Dashboard'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <div className="p-4">
                    <Dashboard />
                </div>
            </ThemeProvider>
        </>
    )
}

export default App
