import React, { useState, useEffect } from 'react'
import Button from './ui/Button'

interface AboutProps {
  onClose: () => void
}

const AboutTailwind: React.FC<AboutProps> = ({ onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-surface border border-border rounded-lg w-[500px] max-w-[90%] max-h-[90%] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="m-0 text-lg text-text">About Textonom</h2>
          <button
            className="bg-transparent border-none text-text text-base cursor-pointer p-1 rounded hover:bg-surface-hover"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-center">
          <div
            className="w-[100px] h-[100px] mx-auto mb-4 bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage:
                "url('../assets/e55776f0-9aff-49ea-ba3c-7c796e1a98cf-no-background.png')"
            }}
          ></div>

          <h1 className="m-0 text-2xl text-text">Textonom</h1>
          <p className="my-2 mb-4 text-secondary text-sm">Version {appVersion}</p>

          <p className="mb-6 text-text">
            A text editor that lets you perform common text transformations locally.
          </p>

          <div className="mb-6 text-left">
            <h3 className="mt-0 mb-3 text-base text-text border-b border-border pb-2">Features</h3>
            <ul className="m-0 pl-6">
              <li className="mb-1">Base64 encoding/decoding</li>
              <li className="mb-1">JSON formatting and minification</li>
              <li className="mb-1">URL encoding/decoding</li>
              <li className="mb-1">Case conversion</li>
              <li className="mb-1">XML formatting</li>
              <li className="mb-1">Line operations</li>
              <li className="mb-1">HTML encoding/decoding</li>
              <li className="mb-1">Cryptographic hashing</li>
              <li className="mb-1">Format conversion (JSON/YAML)</li>
              <li className="mb-1">And more...</li>
            </ul>
          </div>

          <div className="mb-6 text-left">
            <h3 className="mt-0 mb-3 text-base text-text border-b border-border pb-2">Credits</h3>
            <p>
              Created by{' '}
              <a
                href="https://netroforge.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                Netroforge
              </a>
            </p>
            <p>
              <a
                href="https://github.com/Netroforge/textonom"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary no-underline hover:underline"
              >
                GitHub Repository
              </a>
            </p>
          </div>

          <div className="mb-6 text-left">
            <h3 className="mt-0 mb-3 text-base text-text border-b border-border pb-2">License</h3>
            <p>
              This software is open source and available under the Apache License Version 2.0
              license.
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutTailwind
