import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { useTeleprompter } from '@/hooks/useTeleprompter'
import { parseMarkdown } from '@/utils/markdown'

const STORAGE_KEY = 'teleprompter-settings'

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

  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editorViewMode, setEditorViewMode] = useState<'split' | 'preview' | 'write'>('write')
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
        bgTertiary: 'bg-zinc-800',
        border: 'border-zinc-700',
        text: 'text-white',
        textSecondary: 'text-zinc-400',
        textMuted: 'text-zinc-500',
        hover: 'hover:bg-zinc-700/50',
        input: 'bg-zinc-900 text-white placeholder-zinc-600',
      }
    : {
        bg: 'bg-white/90',
        bgSecondary: 'bg-gray-100',
        bgTertiary: 'bg-gray-200',
        border: 'border-gray-300',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-500',
        hover: 'hover:bg-gray-300/50',
        input: 'bg-gray-100 text-gray-900 placeholder-gray-500',
      }

  // Memoize parsed markdown to avoid re-parsing on every render
  const parsedContent = useMemo(() => {
    return text ? parseMarkdown(text, theme) : ''
  }, [text, theme])

  // Default content when empty - uses theme-based colors
  const defaultContent = useMemo(() => {
    const linkClass = theme === 'dark' 
      ? 'text-zinc-400 hover:text-zinc-300' 
      : 'text-gray-500 hover:text-gray-600'
    return `<div class="text-center">
      <div class="text-4xl mb-4">📜</div>
      <h1 class="text-2xl font-bold mb-4">Teleprompter</h1>
      <p class="mb-4">Clique duas vezes seguidas aqui ou abra o editor...</p>
      <p class="text-sm opacity-75 mb-2">Use ESPAÇO para play/pause</p>
      <p class="text-sm opacity-75 mb-2">↑↓ para velocidade</p>
      <p class="text-sm opacity-75 mb-2">←→ para tamanho da fonte</p>
      <p class="text-sm opacity-75 mb-4">ESC para reset</p>
      <p class="text-sm opacity-60"><a href="https://www.linkedin.com/in/filipeleonelbatista" target="_blank" rel="noopener" class="${linkClass} transition-colors">Feito com &lt;3 por Filipe Batista</a></p>
    </div>`
  }, [theme])

  // Load saved settings from localStorage on mount
  const initRef = useRef(true)
  useEffect(() => {
    if (!initRef.current) return
    initRef.current = false

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.fontSize) setFontSize(parsed.fontSize)
        if (parsed.scrollSpeed) setScrollSpeed(parsed.scrollSpeed)
        if (parsed.opacity) setOpacity(parsed.opacity)
        if (parsed.alwaysOnTop !== undefined) setAlwaysOnTop(parsed.alwaysOnTop)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [setFontSize, setScrollSpeed, setOpacity, setAlwaysOnTop])

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fontSize: settings.fontSize,
        scrollSpeed: settings.scrollSpeed,
        opacity: settings.opacity,
        alwaysOnTop: settings.alwaysOnTop
      }))
    } catch {
      // Ignore localStorage errors
    }
  }, [settings.fontSize, settings.scrollSpeed, settings.opacity, settings.alwaysOnTop])

  // Scroll animation - smooth continuous scroll
  useEffect(() => {
    if (!isPlaying) return

    const content = contentRef.current
    if (!content) return

    content.scrollTop = 0
    setProgress(0)

    scrollRef.current = setInterval(() => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const max = scrollHeight - clientHeight
      const step = settings.scrollSpeed / 10

      if (scrollTop < max) {
        contentRef.current.scrollTop += step
        const progress = (contentRef.current.scrollTop / max) * 100
        setProgress(progress)
      } else {
        setProgress(100)
        reset()
      }
    }, 50)

    return () => {
      if (scrollRef.current) {
        clearInterval(scrollRef.current)
        scrollRef.current = null
      }
    }
  }, [isPlaying, settings.scrollSpeed, reset])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable shortcuts when editor is open
      if (showEditor) return

      // Ignore if user is typing in textarea
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowUp':
          e.preventDefault()
          setScrollSpeed(settings.scrollSpeed + 10)
          break
        case 'ArrowDown':
          e.preventDefault()
          setScrollSpeed(Math.max(10, settings.scrollSpeed - 10))
          break
        case 'ArrowLeft':
          e.preventDefault()
          setFontSize(settings.fontSize - 2)
          break
        case 'ArrowRight':
          e.preventDefault()
          setFontSize(Math.min(72, settings.fontSize + 2))
          break
        case 'KeyH':
          // Toggle visibility (H = Hide/Show) - useful for OBS capture
          // This is handled by global shortcut in main.ts (Ctrl+Shift+T)
          break
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) return
          e.preventDefault()
          if (contentRef.current) contentRef.current.scrollTop = 0
          setProgress(0)
          reset()
          break
        case 'Escape':
          e.preventDefault()
          if (contentRef.current) contentRef.current.scrollTop = 0
          setProgress(0)
          reset()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, setScrollSpeed, setFontSize, settings.scrollSpeed, settings.fontSize, reset, showEditor])

  const handleWindowControls = useCallback(async (action: 'minimize' | 'maximize' | 'close') => {
    if (window.electronAPI && window.electronAPI[action]) {
      try {
        await window.electronAPI[action]()
      } catch (err) {
        console.error('Window control error:', err)
      }
    }
  }, [])

  const handleSpeedChange = (delta: number) => {
    setScrollSpeed(Math.max(10, Math.min(400, settings.scrollSpeed + delta)))
  }

  const handleFontChange = (delta: number) => {
    setFontSize(Math.max(16, Math.min(72, settings.fontSize + delta)))
  }

  // Insert markdown formatting at cursor position
  const insertMarkdown = useCallback((before: string, after: string) => {
    if (!editorRef.current) return
    
    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    setText(newText)
    
    // Restore cursor position
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus()
        editorRef.current.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }
    }, 0)
  }, [text, setText])

  // Update progress when manually scrolling
  const handleScroll = useCallback(() => {
    if (contentRef.current && !isPlaying) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const maxScroll = scrollHeight - clientHeight
      const currentProgress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0
      setProgress(currentProgress)
    }
  }, [isPlaying])

  return (
    <div 
      className={`flex flex-col h-screen ${themeClasses.bg} backdrop-blur-sm rounded-lg overflow-hidden`}
      style={{ 
        opacity: settings.opacity,
        fontSize: settings.fontSize > 24 ? settings.fontSize - 8 : settings.fontSize 
      }}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* Title Bar - macOS Style */}
      <header 
        className={`flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 border-zinc-700/50' : 'bg-gradient-to-b from-gray-200/80 to-gray-100/80 border-gray-300/50'} select-none`}
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* Traffic Lights */}
        <div 
          className="flex gap-2"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            onClick={() => handleWindowControls('close')}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            aria-label="Fechar"
            title="Fechar"
          />
          <button
            onClick={() => handleWindowControls('minimize')}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            aria-label="Minimizar"
            title="Minimizar"
          />
          <button
            onClick={() => handleWindowControls('maximize')}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
            aria-label="Maximizar"
            title="Maximizar"
          />
        </div>

        <div className="flex-1 text-center">
          <h1 className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>Teleprompter</h1>
        </div>

        {/* Editor/Close Button */}
        {showEditor ? (
          <button
            onClick={() => {
              setShowEditor(false)
              if (contentRef.current) contentRef.current.scrollTop = 0
              setProgress(0)
              reset()
            }}
            className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-zinc-600 hover:bg-zinc-700 text-zinc-300' : 'border-gray-400 hover:bg-gray-300 text-gray-700'}`}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            aria-label="Close editor"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setShowEditor(true)}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700/50' : 'hover:bg-gray-300/50'}`}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            aria-label="Open text editor"
            title="Editar texto"
          >
            <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}

        <div className="w-4" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700/50' : 'hover:bg-gray-300/50'}`}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark' ? (
            <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className={`w-4 h-4 ${theme === 'light' ? 'text-gray-600' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      {/* Progress Bar */}
      <div className={`h-1 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-300'}`}>
        <div 
          className="h-full bg-blue-600 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Control Panel */}
      <div 
        className={`flex items-center justify-between px-6 py-2 ${theme === 'dark' ? 'bg-zinc-900/80 border-zinc-700/50' : 'bg-gray-100/80 border-gray-300/50'} border-b transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Playback Controls (Left) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (contentRef.current) contentRef.current.scrollTop = 0
              setProgress(0)
              reset()
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all active:scale-95 ${theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-700 text-zinc-300' : 'border-gray-400 hover:bg-gray-300 text-gray-700'}`}
            aria-label="Reset (Esc)"
            title="Reset"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95"
            aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeedChange(-10)}
              className={`w-5 h-5 flex items-center justify-center rounded ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`}
              aria-label="Decrease speed"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="range"
              min={10}
              max={400}
              value={settings.scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-20 accent-blue-600"
              aria-label={`Speed: ${settings.scrollSpeed}`}
            />
            <button
              onClick={() => handleSpeedChange(10)}
              className={`w-5 h-5 flex items-center justify-center rounded ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`}
              aria-label="Increase speed"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className={`text-xs min-w-[60px] text-center ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>Velocidade: {settings.scrollSpeed}</span>
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFontChange(-2)}
              className={`w-5 h-5 flex items-center justify-center rounded ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`}
              aria-label="Decrease font size"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="range"
              min={16}
              max={72}
              value={settings.fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 accent-blue-600"
              aria-label={`Font size: ${settings.fontSize}px`}
            />
            <button
              onClick={() => handleFontChange(2)}
              className={`w-5 h-5 flex items-center justify-center rounded ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'}`}
              aria-label="Increase font size"
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className={`text-xs min-w-[50px] text-center ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>Fonte: {settings.fontSize}</span>
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.25}
              max={1}
              step={0.05}
              value={settings.opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-20 accent-blue-600"
              aria-label={`Opacity: ${Math.round(settings.opacity * 100)}%`}
            />
            <span className={`text-xs min-w-[60px] text-center ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>Opacidade: {Math.round(settings.opacity * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Gradient Fade at Bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t pointer-events-none z-10 ${theme === 'dark' ? 'from-black/90' : 'from-gray-200/90'}`} />

        {/* Teleprompter Display */}
        <div
          ref={contentRef}
          className={`flex-1 p-8 overflow-y-auto scroll-smooth cursor-text ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          style={{ fontSize: `${settings.fontSize}px` }}
          onScroll={handleScroll}
          onDoubleClick={() => setShowEditor(true)}
          role="region"
          aria-label="Teleprompter content"
        >
          <div 
            className={`max-w-3xl mx-auto leading-[1.8] ${theme === 'dark' ? 'prose prose-invert' : 'prose'}`}
            dangerouslySetInnerHTML={{ 
              __html: parsedContent || defaultContent
            }}
          />
        </div>
      </div>

      {/* Text Editor Modal */}
      {showEditor && (
        <div 
          className={`fixed mt-3 inset-0 z-50 backdrop-blur-sm flex flex-col ${theme === 'dark' ? 'bg-zinc-900/95' : 'bg-gray-100/95'}`}
          style={{ top: '40px' }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowEditor(false)
          }}
        >
{/* Editor Toolbar - Title, formatting buttons, and save */}
          <div className={`flex items-center justify-between px-3 border-b ${theme === 'dark' ? 'border-zinc-700 bg-zinc-800' : 'border-gray-300 bg-gray-200'}`}>
            {/* Left: Title */}
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className={`text-sm font-medium ${theme === 'dark' ? 'text-zinc-200' : 'text-gray-800'}`}>Editar</h2>
            </div>

            {/* Center: Formatting toolbar */}
            <div className={`flex items-center gap-1 ${theme === 'dark' ? 'bg-zinc-800/50' : 'bg-gray-200/50'} px-2 py-1 rounded`}>
              <button
                onClick={() => setEditorViewMode('write')}
                className={`p-1.5 rounded transition-colors ${editorViewMode === 'write' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`}
                title="Escrever"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48">
                  <rect width="28" height="36" x="6" y="6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" rx="2"></rect>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M42 6v36"></path>
                </svg>
              </button>
              <button
                onClick={() => setEditorViewMode('preview')}
                className={`p-1.5 rounded transition-colors ${editorViewMode === 'preview' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`}
                title="Visualizar"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48">
                  <rect width="28" height="36" x="14" y="6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" rx="2"></rect>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 6v36"></path>
                </svg>
              </button>
              
              {editorViewMode === 'write' && (
                <>
                <div className={`w-px h-5 mx-0.5 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-400'}`} />
                  <button onClick={() => insertMarkdown('**', '**')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Negrito (Ctrl+B)">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                    </svg>
                  </button>
                  <button onClick={() => insertMarkdown('*', '*')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Itálico (Ctrl+I)">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m4 0h-4" transform="skewX(-10)" />
                    </svg>
                  </button>
                  <button onClick={() => insertMarkdown('# ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Título">
                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">H1</span>
                  </button>
                  <button onClick={() => insertMarkdown('## ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Subtítulo">
                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">H2</span>
                  </button>
                  <div className={`w-px h-5 mx-0.5 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-400'}`} />
                  <button onClick={() => insertMarkdown('- ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Lista">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button onClick={() => insertMarkdown('1. ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Lista numerada">
                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">1.</span>
                  </button>
                  <div className={`w-px h-5 mx-0.5 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-400'}`} />
                  <button onClick={() => insertMarkdown('> ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Citação">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>
                  <button onClick={() => insertMarkdown('---', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Linha horizontal">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  </button>
                  <div className={`w-px h-5 mx-0.5 ${theme === 'dark' ? 'bg-zinc-700' : 'bg-gray-400'}`} />
                  <button onClick={() => insertMarkdown('[', '](url)')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>
                  <button onClick={() => insertMarkdown('- [ ] ', '')} className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200' : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'}`} title="Lista de tarefas">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Right: Save button */}
            <button
              onClick={() => {
                setShowEditor(false)
                if (contentRef.current) contentRef.current.scrollTop = 0
                setProgress(0)
                reset()
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Salvar
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex flex-1 overflow-hidden mt-4">
            {editorViewMode === 'write' ? (
              /* Write Mode - Only editor textarea */
              <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                <textarea
                  ref={editorRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Digite ou cole seu texto aqui..."
                  className={`flex-1 p-4 text-base leading-relaxed resize-none focus:outline-none ${theme === 'dark' ? 'bg-zinc-900 text-white placeholder-zinc-600' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                  autoFocus
                />
              </div>
            ) : (
              /* Preview Mode - Show only parsed markdown */
              <div className={`flex-1 p-4 overflow-y-auto leading-[1.8] ${theme === 'dark' ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
                <div 
                  className="max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: parsedContent || `<p class="${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'} italic text-center">Digite seu texto para ver a prévia...</p>` }}
                />
              </div>
            )}
          </div>

          {/* Markdown Notice */}
          <div className={`flex items-center justify-between px-3 py-1.5 border-t ${theme === 'dark' ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500' : 'bg-gray-200/50 border-gray-300 text-gray-600'}`}>
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Este editor suporta marcações Markdown: **negrito**, *itálico*, # títulos, - listas, etc.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App