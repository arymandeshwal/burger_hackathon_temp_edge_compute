'use client'

import { useState, useEffect } from 'react'
import DeviceSetup from '../components/DeviceSetup'
import Thermometer from '../components/Thermometer'
import TemperatureSlider from '../components/TemperatureSlider'
import useTemperatureInput from '../hooks/useTemperatureInput'

export default function Home() {
  const [deviceName, setDeviceName] = useState(null)
  const { temperature, setTemperature, isSending, error } = useTemperatureInput(deviceName)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  const handleDeviceSet = (name) => {
    setDeviceName(name)
  }

  const handleChangeDevice = () => {
    setDeviceName(null)
  }

  if (!deviceName) {
    return (
      <div className="app">
        <DeviceSetup onDeviceSet={handleDeviceSet} />
      </div>
    )
  }

  return (
    <div className="app">
      <div className="input-screen">
        <div className="input-header">
          <span className="device-name">{deviceName}</span>
          <button className="change-button" onClick={handleChangeDevice}>
            Change Device
          </button>
        </div>

        <div className="temp-display">
          <Thermometer temperature={temperature} />
          <TemperatureSlider
            value={temperature}
            onChange={setTemperature}
          />
        </div>

        <div className="status-bar">
          <div className={`status-dot ${isSending ? 'sending' : ''}`} />
          <span className="status-text">
            {isSending ? 'Sending...' : 'Connected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-toast">
          {error}
        </div>
      )}
    </div>
  )
}
