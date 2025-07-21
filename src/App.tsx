import { Dashboard } from "./Dashboard"
import { MarketsProvider } from "./hooks/Markets"

function App() {
    return <MarketsProvider>
        <Dashboard />
    </MarketsProvider>
}

export default App
