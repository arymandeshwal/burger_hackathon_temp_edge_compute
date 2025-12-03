import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function checkDeviceExists(deviceName) {
  if (!supabase) return { exists: false, error: 'Supabase not configured' }

  try {
    const { data, error } = await supabase
      .from('temperature_readings')
      .select('device_name')
      .eq('device_name', deviceName)
      .limit(1)

    if (error) throw error

    return { exists: data && data.length > 0, error: null }
  } catch (err) {
    return { exists: false, error: err.message }
  }
}

export async function insertTemperatureReading(deviceName, temperature) {
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  try {
    const { error } = await supabase
      .from('temperature_readings')
      .insert({
        device_name: deviceName,
        temperature: temperature,
        recorded_at: new Date().toISOString()
      })

    if (error) throw error

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
