import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'teleprompter-settings'

interface StoredSettings {
  fontSize?: number
  scrollSpeed?: number
  opacity?: number
  alwaysOnTop?: boolean
}

interface UseLocalStorageOptions {
  fontSize: number
  scrollSpeed: number
  opacity: number
  alwaysOnTop: boolean
  setFontSize: (size: number) => void
  setScrollSpeed: (speed: number) => void
  setOpacity: (opacity: number) => void
  setAlwaysOnTop: (value: boolean) => void
}

export function useLocalStorage({
  fontSize,
  scrollSpeed,
  opacity,
  alwaysOnTop,
  setFontSize,
  setScrollSpeed,
  setOpacity,
  setAlwaysOnTop,
}: UseLocalStorageOptions) {
  const initRef = useRef(true)

  // Load saved settings on mount
  useEffect(() => {
    if (!initRef.current) return
    initRef.current = false

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: StoredSettings = JSON.parse(saved)
        if (parsed.fontSize) setFontSize(parsed.fontSize)
        if (parsed.scrollSpeed) setScrollSpeed(parsed.scrollSpeed)
        if (parsed.opacity) setOpacity(parsed.opacity)
        if (parsed.alwaysOnTop !== undefined) setAlwaysOnTop(parsed.alwaysOnTop)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [setFontSize, setScrollSpeed, setOpacity, setAlwaysOnTop])

  // Save settings when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fontSize,
        scrollSpeed,
        opacity,
        alwaysOnTop,
      }))
    } catch {
      // Ignore localStorage errors
    }
  }, [fontSize, scrollSpeed, opacity, alwaysOnTop])
}