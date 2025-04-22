import React, { useState } from 'react'
import BaseTransformationPage from './BaseTransformationPage'
import { bcryptHash } from '../../transformations/hash'
import { useSettingsStore } from '../../stores/settingsStore'
import { TransformationParamValues } from '../../types/transformation'
import BcryptDialog from '../BcryptDialog'

interface BcryptHashPageProps {
  tabId: string
}

const BcryptHashPage: React.FC<BcryptHashPageProps> = ({ tabId }) => {
  const { settings } = useSettingsStore()
  const [rounds, setRounds] = useState(settings.bcryptRounds || 12)
  const [showBcryptDialog, setShowBcryptDialog] = useState(false)

  // Handle rounds change
  const handleRoundsChange = (newRounds: number): void => {
    setRounds(newRounds)
  }

  // Parameters component
  const Parameters = (
    <div className="parameter-row">
      <label className="parameter-label" htmlFor="rounds">
        Rounds (Cost Factor):
      </label>
      <div style={{ display: 'flex', gap: '8px', flex: 2 }}>
        <input
          id="rounds"
          type="number"
          className="parameter-input"
          style={{ flex: 1 }}
          min="1"
          max="20"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
        />
        <button
          className="parameter-button"
          onClick={() => setShowBcryptDialog(true)}
          title="Bcrypt Settings"
        >
          Settings
        </button>
      </div>
    </div>
  )

  // Transform function with rounds parameter
  const transform = async (text: string, params?: TransformationParamValues): Promise<string> => {
    const roundsValue = params?.rounds ? Number(params.rounds) : rounds
    return bcryptHash(text, roundsValue)
  }

  return (
    <>
      <BaseTransformationPage
        tabId={tabId}
        transformationName="Bcrypt Hash"
        transformationDescription="Generate bcrypt hash of text (secure password hashing)"
        inputPlaceholder="Enter text to hash..."
        outputPlaceholder="Bcrypt hash will appear here..."
        transformButtonText="Hash"
        transformFunction={transform}
        parameters={Parameters}
      />

      {showBcryptDialog && (
        <BcryptDialog
          onClose={() => setShowBcryptDialog(false)}
          onApply={handleRoundsChange}
          initialRounds={rounds}
        />
      )}
    </>
  )
}

export default BcryptHashPage
