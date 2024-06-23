import React from 'react'
import SurveyForm from './components/SurveyForm'
import { FormProvider } from './components/SurveyFormContext'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    
    <FormProvider>
      <Toaster position='bottom-right' toastOptions={{duration : 3000}}  />
      <SurveyForm />
    </FormProvider>
  )
}

export default App
