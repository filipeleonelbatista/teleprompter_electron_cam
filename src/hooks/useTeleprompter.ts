import { useState, useCallback, useEffect } from 'react'

export interface TeleprompterSettings {
  fontSize: number
  scrollSpeed: number
  opacity: number
  alwaysOnTop: boolean
  isPlaying: boolean
}

export interface UseTeleprompterReturn {
  text: string
  setText: (text: string) => void
  settings: TeleprompterSettings
  togglePlay: () => void
  setFontSize: (size: number) => void
  setScrollSpeed: (speed: number) => void
  setOpacity: (opacity: number) => void
  setAlwaysOnTop: (value: boolean) => void
  reset: () => void
  isPlaying: boolean
}

const DEFAULT_SETTINGS: TeleprompterSettings = {
  fontSize: 32,
  scrollSpeed: 50,
  opacity: 1,
  alwaysOnTop: true,
  isPlaying: false
}

export function useTeleprompter(): UseTeleprompterReturn {
  const [text, setText] = useState('')
  const [settings, setSettings] = useState<TeleprompterSettings>(DEFAULT_SETTINGS)

  const isPlaying = settings.isPlaying

  const togglePlay = useCallback(() => {
    setSettings(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }, [])

  const setFontSize = useCallback((size: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(16, Math.min(72, size)) }))
  }, [])

  const setScrollSpeed = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, scrollSpeed: Math.max(10, Math.min(400, speed)) }))
  }, [])

  const setOpacity = useCallback((opacity: number) => {
    setSettings(prev => ({ ...prev, opacity: Math.max(0.25, Math.min(1, opacity)) }))
  }, [])

  const setAlwaysOnTop = useCallback((value: boolean) => {
    setSettings(prev => ({ ...prev, alwaysOnTop: value }))
  }, [])

  const reset = useCallback(() => {
    setSettings(prev => ({ ...prev, isPlaying: false }))
  }, [])

  // Apply opacity to window when it changes
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setOpacity(settings.opacity)
    }
  }, [settings.opacity])

  // Apply always on top when it changes
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.setAlwaysOnTop(settings.alwaysOnTop)
    }
  }, [settings.alwaysOnTop])

  return {
    text,
    setText,
    settings,
    togglePlay,
    setFontSize,
    setScrollSpeed,
    setOpacity,
    setAlwaysOnTop,
    reset,
    isPlaying
  }
}