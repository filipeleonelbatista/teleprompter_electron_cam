import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsOptions {
  onPlayPause: () => void
  onSpeedUp: () => void
  onSpeedDown: () => void
  onFontIncrease: () => void
  onFontDecrease: () => void
  onReset: () => void
  isInputFocused: boolean
}

export function useKeyboardShortcuts({
  onPlayPause,
  onSpeedUp,
  onSpeedDown,
  onFontIncrease,
  onFontDecrease,
  onReset,
  isInputFocused,
}: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore shortcuts when user is typing in an input
    if (isInputFocused) return

    // Ignore if ctrl/meta is pressed (browser shortcuts)
    if (e.ctrlKey || e.metaKey) return

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        onPlayPause()
        break
      case 'ArrowUp':
        e.preventDefault()
        onSpeedUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        onSpeedDown()
        break
      case 'ArrowLeft':
        e.preventDefault()
        onFontDecrease()
        break
      case 'ArrowRight':
        e.preventDefault()
        onFontIncrease()
        break
      case 'Escape':
        e.preventDefault()
        onReset()
        break
      case 'KeyR':
        e.preventDefault()
        onReset()
        break
    }
  }, [onPlayPause, onSpeedUp, onSpeedDown, onFontIncrease, onFontDecrease, onReset, isInputFocused])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}