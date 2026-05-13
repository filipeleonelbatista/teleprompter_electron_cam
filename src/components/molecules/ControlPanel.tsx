import { useCallback } from 'react'

interface ControlPanelProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onReset: () => void
  fontSize: number
  onFontSizeChange: (size: number) => void
  scrollSpeed: number
  onScrollSpeedChange: (speed: number) => void
  opacity: number
  onOpacityChange: (opacity: number) => void
  theme: 'dark' | 'light'
}

export function ControlPanel({
  isPlaying,
  onTogglePlay,
  onReset,
  fontSize,
  onFontSizeChange,
  scrollSpeed,
  onScrollSpeedChange,
  opacity,
  onOpacityChange,
  theme,
}: ControlPanelProps) {
  const themeClasses = theme === 'dark'
    ? {
        bg: 'bg-zinc-900/80',
        border: 'border-zinc-700/50',
        text: 'text-zinc-300',
        buttonBorder: 'border-zinc-700 hover:bg-zinc-700',
        buttonText: 'text-zinc-300',
        inputBg: 'bg-zinc-800',
      }
    : {
        bg: 'bg-gray-100/80',
        border: 'border-gray-300/50',
        text: 'text-gray-700',
        buttonBorder: 'border-gray-400 hover:bg-gray-300',
        buttonText: 'text-gray-700',
        inputBg: 'bg-gray-300',
      }

  const handleFontChange = useCallback((delta: number) => {
    onFontSizeChange(Math.max(16, Math.min(72, fontSize + delta)))
  }, [fontSize, onFontSizeChange])

  const handleSpeedChange = useCallback((delta: number) => {
    onScrollSpeedChange(Math.max(10, Math.min(400, scrollSpeed + delta)))
  }, [scrollSpeed, onScrollSpeedChange])

  return (
    <div 
      className={`flex items-center justify-between px-6 py-2 ${themeClasses.bg} ${themeClasses.border} border-b transition-opacity duration-300`}
      role="region"
      aria-label="Control Panel"
    >
      {/* Playback Controls (Left) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all active:scale-95 ${themeClasses.buttonBorder} ${themeClasses.buttonText}`}
          aria-label="Reset"
          title="Reset"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
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
            className={`w-5 h-5 flex items-center justify-center rounded ${themeClasses.inputBg} ${themeClasses.buttonText}`}
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
            value={scrollSpeed}
            onChange={(e) => onScrollSpeedChange(Number(e.target.value))}
            className="w-20 accent-blue-600"
            aria-label={`Speed: ${scrollSpeed}`}
          />
          <button
            onClick={() => handleSpeedChange(10)}
            className={`w-5 h-5 flex items-center justify-center rounded ${themeClasses.inputBg} ${themeClasses.buttonText}`}
            aria-label="Increase speed"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <span className={`text-xs min-w-[60px] text-center ${themeClasses.text}`}>Velocidade: {scrollSpeed}</span>
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontChange(-2)}
            className={`w-5 h-5 flex items-center justify-center rounded ${themeClasses.inputBg} ${themeClasses.buttonText}`}
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
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-20 accent-blue-600"
            aria-label={`Font size: ${fontSize}px`}
          />
          <button
            onClick={() => handleFontChange(2)}
            className={`w-5 h-5 flex items-center justify-center rounded ${themeClasses.inputBg} ${themeClasses.buttonText}`}
            aria-label="Increase font size"
          >
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <span className={`text-xs min-w-[50px] text-center ${themeClasses.text}`}>Fonte: {fontSize}</span>
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
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-20 accent-blue-600"
            aria-label={`Opacity: ${Math.round(opacity * 100)}%`}
          />
          <span className={`text-xs min-w-[60px] text-center ${themeClasses.text}`}>Opacidade: {Math.round(opacity * 100)}%</span>
        </div>
      </div>
    </div>
  )
}