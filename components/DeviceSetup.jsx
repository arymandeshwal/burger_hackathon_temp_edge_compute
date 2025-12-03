'use client'

import { useState } from 'react'
import { checkDeviceExists } from '../lib/supabase'

export default function DeviceSetup({ onDeviceSet }) {
  const [deviceName, setDeviceName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deviceExists, setDeviceExists] = useState(false)
  const [error, setError] = useState(null)

  const handleCheck = async () => {
    if (!deviceName.trim()) return

    setLoading(true)
    setError(null)

    const { exists, error: checkError } = await checkDeviceExists(deviceName.trim())

    if (checkError) {
      setError(checkError)
      setLoading(false)
      return
    }

    setDeviceExists(exists)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!deviceName.trim()) return

    // If we haven't checked yet, check first
    if (!deviceExists && !loading) {
      await handleCheck()
    }

    onDeviceSet(deviceName.trim())
  }

  const handleInputChange = (e) => {
    setDeviceName(e.target.value)
    setDeviceExists(false)
    setError(null)
  }

  const handleBlur = () => {
    if (deviceName.trim()) {
      handleCheck()
    }
  }

  return (
    <div className="setup-screen">
      <form className="setup-card" onSubmit={handleSubmit}>
        <h1 className="setup-title">Temperature Input</h1>
        <p className="setup-subtitle">Enter the device name to start monitoring</p>

        <div className="input-group">
          <label className="input-label" htmlFor="device-name">
            Device Name
          </label>
          <input
            id="device-name"
            type="text"
            className="input-field"
            placeholder="e.g., Mold-Station-1"
            value={deviceName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        {deviceExists && (
          <div className="device-warning">
            Device "{deviceName}" already exists. New readings will be added to it.
          </div>
        )}

        {error && (
          <div className="device-warning" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={!deviceName.trim() || loading}
        >
          {loading ? 'Checking...' : 'Start Monitoring'}
        </button>
      </form>
    </div>
  )
}
