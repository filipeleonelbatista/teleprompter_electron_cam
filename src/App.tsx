import { useState, useCallback } from 'react'
import { useTeleprompter } from '@/hooks/useTeleprompter'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TitleBar } from '@/components/molecules/TitleBar'
import { ControlPanel } from '@/components/molecules/ControlPanel'
import { TeleprompterContent } from '@/components/molecules/TeleprompterContent'
import { Editor } from '@/components/molecules/Editor'

function App() {
  const {
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
  } = useTeleprompter()

  const [progress, setProgress] = useState(0)
  const [showControls] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // Theme-based classes
  const themeClasses = theme === 'dark'
    ? {
        bg: 'bg-black/90',
        bgSecondary: 'bg-zinc-900',
      }
    : {
        bg: 'bg-white/90',
        bgSecondary: 'bg-gray-100',
      }

  // Use localStorage hook for persistence
  useLocalStorage({
    fontSize: settings.fontSize,
    scrollSpeed: settings.scrollSpeed,
    opacity: settings.opacity,
    alwaysOnTop: settings.alwaysOnTop,
    setFontSize,
    setScrollSpeed,
    setOpacity,
    setAlwaysOnTop,
  })

  // Use scroll animation hook
  const { contentRef, resetScroll: resetScrollContent } = useScrollAnimation({
    isPlaying,
    scrollSpeed: settings.scrollSpeed,
    onProgressChange: setProgress,
    onComplete: reset,
  })

  // Handle reset
  const handleReset = useCallback(() => {
    resetScrollContent()
    reset()
  }, [resetScrollContent, reset])

  // Use keyboard shortcuts hook
  useKeyboardShortcuts({
    onPlayPause: togglePlay,
    onSpeedUp: () => setScrollSpeed(settings.scrollSpeed + 10),
    onSpeedDown: () => setScrollSpeed(Math.max(10, settings.scrollSpeed - 10)),
    onFontIncrease: () => setFontSize(Math.min(72, settings.fontSize + 2)),
    onFontDecrease: () => setFontSize(Math.max(16, settings.fontSize - 2)),
    onReset: handleReset,
    isInputFocused: showEditor,
  })

  // Window controls
  const handleWindowControls = useCallback(async (action: 'minimize' | 'maximize' | 'close') => {
    if (window.electronAPI && window.electronAPI[action]) {
      try {
        await window.electronAPI[action]()
      } catch (err) {
        console.error('Window control error:', err)
      }
    }
  }, [])

  // Editor save handler
  const handleEditorSave = useCallback(() => {
    setShowEditor(false)
    handleReset()
  }, [handleReset])

  return (
    <div 
      className={`flex flex-col h-screen ${themeClasses.bg} backdrop-blur-sm rounded-lg overflow-hidden`}
      style={{ 
        opacity: settings.opacity,
        fontSize: settings.fontSize > 24 ? settings.fontSize - 8 : settings.fontSize 
      }}
      onMouseEnter={() => showControls}
    >
      {/* Title Bar */}
      <TitleBar
        onMinimize={() => handleWindowControls('minimize')}
        onMaximize={() => handleWindowControls('maximize')}
        onClose={() => handleWindowControls('close')}
        onToggleEditor={() => {
          setShowEditor(prev => !prev)
          if (showEditor) handleReset()
        }}
        onToggleTheme={toggleTheme}
        showEditor={showEditor}
        theme={theme}
      />

      {/* Progress Bar */}
      <div className={`h-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-300'}`}>
        <div 
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onReset={handleReset}
        fontSize={settings.fontSize}
        onFontSizeChange={setFontSize}
        scrollSpeed={settings.scrollSpeed}
        onScrollSpeedChange={setScrollSpeed}
        opacity={settings.opacity}
        onOpacityChange={setOpacity}
        theme={theme}
      />

      {/* Main Content */}
      <TeleprompterContent
        text={text}
        fontSize={settings.fontSize}
        onDoubleClick={() => setShowEditor(true)}
        onScroll={() => {
          if (!isPlaying && contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current
            const maxScroll = scrollHeight - clientHeight
            const currentProgress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
            setProgress(currentProgress)
          }
        }}
        contentRef={contentRef}
        theme={theme}
      />

      {/* Editor Modal */}
      {showEditor && (
        <Editor
          text={text}
          onTextChange={setText}
          onSave={handleEditorSave}
          onClose={() => {
            setShowEditor(false)
            handleReset()
          }}
          theme={theme}
        />
      )}
    </div>
  )
}

export default App