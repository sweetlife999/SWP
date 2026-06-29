import { useState } from 'react'
import FormsViewerPage from './FormsViewerPage'
import FormBuilderPage from './FormBuilderPage'

type Tab = 'viewer' | 'builder'

export default function ManageQuestionnairesPage() {
  const [tab, setTab] = useState<Tab>('viewer')

  return (
    <>
      <div className="row gap-2" style={{ marginBottom: 24 }}>
        <button
          className={`btn ${tab === 'viewer' ? 'primary' : 'ghost'}`}
          onClick={() => setTab('viewer')}
        >
          View answers
        </button>
        <button
          className={`btn ${tab === 'builder' ? 'primary' : 'ghost'}`}
          onClick={() => setTab('builder')}
        >
          Create a questionnaire
        </button>
      </div>
      {tab === 'viewer' ? <FormsViewerPage /> : <FormBuilderPage />}
    </>
  )
}
