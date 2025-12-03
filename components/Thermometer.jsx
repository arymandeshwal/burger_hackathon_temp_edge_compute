'use client'

export default function Thermometer({ temperature, maxTemp = 500 }) {
  // Calculate mercury height (0-100%)
  const mercuryHeight = Math.min(100, Math.max(0, (temperature / maxTemp) * 100))

  // Get color based on temperature
  const getColor = () => {
    if (temperature >= 400) return 'var(--danger)'
    if (temperature >= 200) return 'var(--warning)'
    if (temperature >= 100) return '#f4a940'
    return 'var(--safe)'
  }

  // Get temperature class
  const getTempClass = () => {
    if (temperature >= 400) return 'overheat'
    if (temperature >= 200) return 'hot'
    if (temperature >= 100) return 'warm'
    return 'cold'
  }

  const isOverheating = temperature >= 400

  return (
    <div className="thermometer-container">
      <div className={`thermometer ${isOverheating ? 'overheating' : ''}`}>
        <div className="thermometer-tube">
          <div
            className="thermometer-mercury"
            style={{
              height: `${mercuryHeight}%`,
              background: getColor()
            }}
          />
        </div>
        <div className="thermometer-bulb">
          <div
            className="thermometer-bulb-fill"
            style={{ background: getColor() }}
          />
        </div>
      </div>
      <div className={`thermometer-reading ${getTempClass()}`}>
        {Math.round(temperature)}°C
      </div>
    </div>
  )
}
