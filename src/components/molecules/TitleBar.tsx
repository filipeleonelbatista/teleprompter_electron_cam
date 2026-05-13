interface TitleBarProps {
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
  onToggleEditor: () => void
  onToggleTheme: () => void
  showEditor: boolean
  theme: 'dark' | 'light'
}

export function TitleBar({ 
  onMinimize, 
  onMaximize, 
  onClose, 
  onToggleEditor, 
  onToggleTheme,
  showEditor,
  theme,
}: TitleBarProps) {
  const headerTheme = theme === 'dark'
    ? 'bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 border-zinc-700/50'
    : 'bg-gradient-to-b from-gray-200/80 to-gray-100/80 border-gray-300/50'
  
  const titleTheme = theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
  const iconTheme = theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
  const buttonTheme = theme === 'dark' 
    ? 'hover:bg-zinc-700/50' 
    : 'hover:bg-gray-300/50'
  const editorButtonTheme = theme === 'dark'
    ? 'border-zinc-600 hover:bg-zinc-700 text-zinc-300'
    : 'border-gray-400 hover:bg-gray-300 text-gray-700'

  return (
    <header 
      className={`flex items-center px-4 py-2 ${headerTheme} select-none`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Traffic Lights */}
      <div 
        className="flex gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={onClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
          aria-label="Fechar"
          title="Fechar"
        />
        <button
          onClick={onMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          aria-label="Minimizar"
          title="Minimizar"
        />
        <button
          onClick={onMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
          aria-label="Maximizar"
          title="Maximizar"
        />
      </div>

      <div className="flex-1 text-center">
        <h1 className={`text-sm font-medium ${titleTheme}`}>Teleprompter</h1>
      </div>

      {/* Editor/Close Button */}
      {showEditor ? (
        <button
          onClick={onToggleEditor}
          className={`p-2 rounded-lg border transition-colors ${editorButtonTheme}`}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          aria-label="Close editor"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onToggleEditor}
          className={`p-2 rounded-lg transition-colors ${buttonTheme}`}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          aria-label="Open text editor"
          title="Editar texto"
        >
          <svg className={`w-4 h-4 ${iconTheme}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}

      <div className="w-4" />

      {/* Theme Toggle Button */}
      <button
        onClick={onToggleTheme}
        className={`p-2 rounded-lg transition-colors ${buttonTheme}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
      >
        {theme === 'dark' ? (
          <svg className={`w-4 h-4 ${iconTheme}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className={`w-4 h-4 ${iconTheme}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </header>
  )
}