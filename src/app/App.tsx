
import { MainLayout } from '../layouts/MainLayout'
import { QueryProvider } from './providers/QueryProvider'

function App() {
  return (
      <QueryProvider>
        <MainLayout />
      </QueryProvider>
  )
}

export default App
