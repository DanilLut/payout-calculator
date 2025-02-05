import './App.css'

import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Dashboard } from '@/components/Dashboard'

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <div className="px-4 py-4">
                    <ThemeToggle />
                    <Dashboard />
                </div>
            </ThemeProvider>
        </>
    )
}

export default App
