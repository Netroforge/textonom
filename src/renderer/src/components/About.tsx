import React, { useState, useEffect } from 'react'
import './About.css'

interface AboutProps {
  onClose: () => void
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  const [appVersion, setAppVersion] = useState<string>('Unknown')

  // Get app version on mount
  useEffect(() => {
    const getVersion = async (): Promise<void> => {
      try {
        const version = await window.api.getAppVersion()
        setAppVersion(version)
      } catch (error) {
        console.error('Failed to get app version:', error)
      }
    }

    getVersion()
  }, [])

  return (
    <div className="about-overlay">
      <div className="about-container">
        <div className="about-header">
          <h2>About Textonom</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="about-content">
          <div className="about-logo"></div>

          <h1>Textonom</h1>
          <p className="version">Version {appVersion}</p>

          <p className="description">
            A text editor that lets you perform common text transformations locally.
          </p>

          <div className="about-section">
            <h3>Features</h3>
            <ul>
              <li>Base64 encoding/decoding</li>
              <li>JSON formatting and minification</li>
              <li>URL encoding/decoding</li>
              <li>Case conversion</li>
              <li>XML formatting</li>
              <li>Line operations</li>
              <li>HTML encoding/decoding</li>
              <li>Cryptographic hashing</li>
              <li>Format conversion (JSON/YAML)</li>
              <li>And more...</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Credits</h3>
            <p>
              Created by{' '}
              <a href="https://netroforge.github.io" target="_blank" rel="noopener noreferrer">
                Netroforge
              </a>
            </p>
            <p>
              <a
                href="https://github.com/Netroforge/textonom"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </p>
          </div>

          <div className="about-section">
            <h3>License</h3>
            <p>
              This software is open source and available under the Apache License Version 2.0
              license.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
