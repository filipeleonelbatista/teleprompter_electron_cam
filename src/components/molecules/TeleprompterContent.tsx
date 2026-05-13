import { useMemo } from 'react'
import { parseMarkdown } from '@/utils/markdown'

interface TeleprompterContentProps {
  text: string
  fontSize: number
  onDoubleClick: () => void
  onScroll?: () => void
  contentRef: React.RefObject<HTMLDivElement>
  theme: 'dark' | 'light'
}

export function TeleprompterContent({
  text,
  fontSize,
  onDoubleClick,
  onScroll,
  contentRef,
  theme,
}: TeleprompterContentProps) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const gradientFrom = theme === 'dark' ? 'from-black/90' : 'from-gray-200/90'
  
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

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Gradient Fade at Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t pointer-events-none z-10 ${gradientFrom}`} />

      {/* Teleprompter Display */}
      <div
        ref={contentRef}
        className={`flex-1 p-8 overflow-y-auto scroll-smooth cursor-text ${textColor}`}
        style={{ fontSize: `${fontSize}px` }}
        onScroll={onScroll}
        onDoubleClick={onDoubleClick}
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
  )
}