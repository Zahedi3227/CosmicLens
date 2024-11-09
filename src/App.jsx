import React from 'react'
import ModernLayout from './components/layout/ModernLayout'
import NasaAPOD from './components/nasa/NasaAPOD'

const App = () => {
  return (
    <ModernLayout>
      <NasaAPOD />
    </ModernLayout>
  )
}

export default App
