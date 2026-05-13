import { useRef, useState, useCallback } from 'react'
import { parseMarkdown } from '@/utils/markdown'

interface EditorProps {
  text: string
  onTextChange: (text: string) => void
  onSave: () => void
  onClose: () => void
  theme: 'dark' | 'light'
}

type EditorViewMode = 'write' | 'preview'

export function Editor({ text, onTextChange, onSave, onClose, theme }: EditorProps) {
  const [viewMode, setViewMode] = useState<EditorViewMode>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const themeClasses = theme === 'dark'
    ? {
        bg: 'bg-zinc-900',
        bgSecondary: 'bg-zinc-800',
        border: 'border-zinc-700',
        text: 'text-zinc-200',
        textMuted: 'text-zinc-500',
        textSecondary: 'text-zinc-400',
        button: 'hover:bg-zinc-700',
        buttonActive: 'bg-blue-600 text-white',
        input: 'bg-zinc-900 text-white placeholder-zinc-600',
      }
    : {
        bg: 'bg-gray-100',
        bgSecondary: 'bg-gray-200',
        border: 'border-gray-300',
        text: 'text-gray-800',
        textMuted: 'text-gray-600',
        textSecondary: 'text-gray-700',
        button: 'hover:bg-gray-300',
        buttonActive: 'bg-blue-600 text-white',
        input: 'bg-gray-100 text-gray-900 placeholder-gray-500',
      }

  const insertMarkdown = useCallback((before: string, after: string) => {
    if (!textareaRef.current) return
    
    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const selectedText = text.substring(start, end)
    
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end)
    onTextChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }
    }, 0)
  }, [text, onTextChange])

  const parsedContent = parseMarkdown(text, theme)

  return (
    <div 
      className={`fixed mt-3 inset-0 z-50 backdrop-blur-sm flex flex-col ${themeClasses.bg}`}
      style={{ top: '40px' }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      {/* Editor Toolbar */}
      <div className={`flex items-center justify-between px-3 border-b ${themeClasses.border} ${themeClasses.bgSecondary}`}>
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 ${themeClasses.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className={`text-sm font-medium ${themeClasses.text}`}>Editar</h2>
        </div>

        {/* Center: Formatting toolbar */}
        <div className={`flex items-center gap-1 ${themeClasses.bgSecondary} px-2 py-1 rounded`}>
          <button
            onClick={() => setViewMode('write')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'write' ? themeClasses.buttonActive : `${themeClasses.button} ${themeClasses.textSecondary}`}`}
            title="Escrever"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48">
              <rect width="28" height="36" x="6" y="6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" rx="2"></rect>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M42 6v36"></path>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'preview' ? themeClasses.buttonActive : `${themeClasses.button} ${themeClasses.textSecondary}`}`}
            title="Visualizar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 48 48">
              <rect width="28" height="36" x="14" y="6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" rx="2"></rect>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 6v36"></path>
            </svg>
          </button>
          
          {viewMode === 'write' && (
            <>
              <div className={`w-px h-5 mx-0.5 ${themeClasses.border}`} />
              <button onClick={() => insertMarkdown('**', '**')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Negrito">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                </svg>
              </button>
              <button onClick={() => insertMarkdown('*', '*')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Itálico">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m4 0h-4" transform="skewX(-10)" />
                </svg>
              </button>
              <button onClick={() => insertMarkdown('# ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Título">
                <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">H1</span>
              </button>
              <button onClick={() => insertMarkdown('## ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Subtítulo">
                <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">H2</span>
              </button>
              <div className={`w-px h-5 mx-0.5 ${themeClasses.border}`} />
              <button onClick={() => insertMarkdown('- ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Lista">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button onClick={() => insertMarkdown('1. ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Lista numerada">
                <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">1.</span>
              </button>
              <div className={`w-px h-5 mx-0.5 ${themeClasses.border}`} />
              <button onClick={() => insertMarkdown('> ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Citação">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
              <button onClick={() => insertMarkdown('---', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Linha horizontal">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                </svg>
              </button>
              <div className={`w-px h-5 mx-0.5 ${themeClasses.border}`} />
              <button onClick={() => insertMarkdown('[', '](url)')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button onClick={() => insertMarkdown('- [ ] ', '')} className={`p-1.5 rounded transition-colors ${themeClasses.button} ${themeClasses.textSecondary}`} title="Lista de tarefas">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Right: Save button */}
        <button
          onClick={onSave}
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
        {viewMode === 'write' ? (
          <div className={`flex-1 flex flex-col ${themeClasses.bg}`}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Digite ou cole seu texto aqui..."
              className={`flex-1 p-4 text-base leading-relaxed resize-none focus:outline-none ${themeClasses.input}`}
              autoFocus
            />
          </div>
        ) : (
          <div className={`flex-1 p-4 overflow-y-auto leading-[1.8] ${theme === 'dark' ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
            <div 
              className="max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ 
                __html: parsedContent || `<p class="${themeClasses.textMuted} italic text-center">Digite seu texto para ver a prévia...</p>` 
              }}
            />
          </div>
        )}
      </div>

      {/* Markdown Notice */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-t ${themeClasses.border} ${themeClasses.bgSecondary} ${themeClasses.textMuted}`}>
        <div className="flex items-center gap-2 text-xs">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Este editor suporta marcações Markdown: **negrito**, *itálico*, # títulos, - listas, etc.</span>
        </div>
      </div>
    </div>
  )
}