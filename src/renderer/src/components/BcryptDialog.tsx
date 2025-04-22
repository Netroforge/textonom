import React, { useState } from 'react'
import './BcryptDialog.css'

interface BcryptDialogProps {
  onClose: () => void
  onApply: (rounds: number) => void
  initialRounds: number
}

const BcryptDialog: React.FC<BcryptDialogProps> = ({ onClose, onApply, initialRounds }) => {
  const [rounds, setRounds] = useState(initialRounds)

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10)
    // Ensure the value is within the allowed range (1-20)
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setRounds(value)
    }
  }

  const handleApply = (): void => {
    onApply(rounds)
    onClose()
  }

  return (
    <div className="bcrypt-dialog-overlay">
      <div className="bcrypt-dialog">
        <div className="bcrypt-dialog-header">
          <h2>Bcrypt Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="bcrypt-dialog-content">
          <div className="bcrypt-dialog-row">
            <label htmlFor="rounds">Rounds (Cost Factor):</label>
            <input
              type="number"
              id="rounds"
              min="1"
              max="20"
              value={rounds}
              onChange={handleRoundsChange}
            />
          </div>

          <div className="bcrypt-dialog-info">
            <p>
              The cost factor controls how many iterations the hashing algorithm performs. Higher
              values are more secure but slower.
            </p>
            <ul>
              <li>
                <strong>1-4:</strong> Very fast, but not secure
              </li>
              <li>
                <strong>5-7:</strong> Fast, minimal security
              </li>
              <li>
                <strong>8-10:</strong> Moderate, acceptable for non-critical applications
              </li>
              <li>
                <strong>11-12:</strong> Standard, good balance of security and performance
              </li>
              <li>
                <strong>13-15:</strong> Secure, slower performance
              </li>
              <li>
                <strong>16-20:</strong> Very secure, significantly slower
              </li>
            </ul>
            <p>
              <strong>Recommended:</strong> 12 (default)
            </p>
          </div>
        </div>

        <div className="bcrypt-dialog-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default BcryptDialog
