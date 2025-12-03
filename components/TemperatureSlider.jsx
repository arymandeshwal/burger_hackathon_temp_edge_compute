'use client'

export default function TemperatureSlider({ value, onChange, min = 0, max = 500 }) {
  const handleChange = (e) => {
    onChange(Number(e.target.value))
  }

  return (
    <div className="slider-container">
      <span className="slider-label top">{max}°C</span>
      <div className="slider-track">
        <input
          type="range"
          className="slider-input"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
      </div>
      <span className="slider-label bottom">{min}°C</span>
    </div>
  )
}
