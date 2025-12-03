'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { insertTemperatureReading } from '../lib/supabase'

const THROTTLE_MS = 500 // Send data every 500ms max

export function useTemperatureInput(deviceName) {
  const [temperature, setTemperature] = useState(25) // Default room temp
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const [lastSentTemp, setLastSentTemp] = useState(null)

  const timeoutRef = useRef(null)
  const pendingTempRef = useRef(null)

  const sendToSupabase = useCallback(async (temp) => {
    if (!deviceName) return

    setIsSending(true)
    setError(null)

    const { success, error: sendError } = await insertTemperatureReading(deviceName, temp)

    setIsSending(false)

    if (!success) {
      setError(sendError)
    } else {
      setLastSentTemp(temp)
    }
  }, [deviceName])

  const handleTemperatureChange = useCallback((newTemp) => {
    // Update local state immediately (optimistic UI)
    setTemperature(newTemp)
    pendingTempRef.current = newTemp

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for throttled send
    timeoutRef.current = setTimeout(() => {
      if (pendingTempRef.current !== null) {
        sendToSupabase(pendingTempRef.current)
        pendingTempRef.current = null
      }
    }, THROTTLE_MS)
  }, [sendToSupabase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return {
    temperature,
    setTemperature: handleTemperatureChange,
    isSending,
    error,
    lastSentTemp
  }
}

export default useTemperatureInput
