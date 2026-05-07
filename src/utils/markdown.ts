// Markdown parser for preview - NO sanitization (for presentation only)
import DOMPurify from 'dompurify'

/**
 * Sanitize raw user input to prevent XSS when storing/editing text
 * Used for the text input/editor
 */
export function sanitizeInput(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

/**
 * Parse markdown to HTML for preview display
 * NO sanitization - only for presentation (overlay)
 * The input is already escaped, and it's a controlled presentation
 */
export function parseMarkdown(text: string, theme: 'dark' | 'light' = 'dark'): string {
  if (!text || !text.trim()) return ''

  // Theme-based colors
  const colors = theme === 'dark'
    ? {
        text: 'text-white',
        textMuted: 'text-zinc-400',
        textSecondary: 'text-zinc-200',
        code: 'bg-zinc-800 text-green-400',
        codeBlock: 'bg-zinc-800',
        codeBlockText: 'text-green-400',
        blockquote: 'text-zinc-400 bg-zinc-800/30 border-zinc-500',
        link: 'text-blue-400 hover:text-blue-300',
        heading: 'text-white',
        hr: 'border-zinc-700',
      }
    : {
        text: 'text-gray-900',
        textMuted: 'text-gray-600',
        textSecondary: 'text-gray-700',
        code: 'bg-gray-200 text-green-600',
        codeBlock: 'bg-gray-200',
        codeBlockText: 'text-green-600',
        blockquote: 'text-gray-600 bg-gray-100/50 border-gray-400',
        link: 'text-blue-600 hover:text-blue-700',
        heading: 'text-gray-900',
        hr: 'border-gray-300',
      }

  const lines = text.split('\n')
  let html = ''
  let inCodeBlock = false
  let codeContent = ''

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre class="${colors.codeBlock} p-3 rounded my-2 overflow-x-auto"><code class="${colors.codeBlockText} text-sm">${escapeHtml(codeContent)}</code></pre>`
        codeContent = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeContent = ''
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += (codeContent ? '\n' : '') + line
      continue
    }

    // Escape HTML to prevent XSS - we only allow markdown syntax
    line = escapeHtml(line)

    // Headers (must be at start of line)
    if (line.match(/^###### /)) {
      html += `<h6 class="text-sm font-bold ${colors.heading} mt-3 mb-1">${line.substring(7)}</h6>\n`
      continue
    }
    if (line.match(/^##### /)) {
      html += `<h5 class="text-base font-bold ${colors.heading} mt-3 mb-1">${line.substring(6)}</h5>\n`
      continue
    }
    if (line.match(/^#### /)) {
      html += `<h4 class="text-lg font-bold ${colors.heading} mt-3 mb-1">${line.substring(5)}</h4>\n`
      continue
    }
    if (line.match(/^### /)) {
      html += `<h3 class="text-xl font-bold ${colors.heading} mt-4 mb-2">${line.substring(4)}</h3>\n`
      continue
    }
    if (line.match(/^## /)) {
      html += `<h2 class="text-2xl font-bold ${colors.heading} mt-4 mb-2">${line.substring(3)}</h2>\n`
      continue
    }
    if (line.match(/^# /)) {
      html += `<h1 class="text-3xl font-bold ${colors.heading} mt-4 mb-2">${line.substring(2)}</h1>\n`
      continue
    }

    // Horizontal rules
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
      html += `<hr class="${colors.hr} my-4" />\n`
      continue
    }

    // Blockquotes (citations)
    if (line.startsWith('&gt; ')) {
      html += `<blockquote class="border-l-4 ${colors.blockquote} pl-4 py-1 my-2 italic rounded-r">${line.substring(5)}</blockquote>\n`
      continue
    }

    // Task list - checked [x] or [X]
    if (line.match(/^-\s*\[[xX]\]\s*/)) {
      const task = line.replace(/^-\s*\[[xX]\]\s*/, '')
      html += `<div class="flex items-center gap-2 my-1"><label class="relative flex items-center cursor-not-allowed"><input type="checkbox" checked disabled class="peer sr-only" /><div class="w-5 h-5 rounded border-2 border-blue-500 bg-blue-500 flex items-center justify-center text-white"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></div></label><span class="${colors.text}">${task}</span></div>\n`
      continue
    }

    // Task list - unchecked [ ]
    if (line.match(/^-\s*\[\s*\]\s*/)) {
      const task = line.replace(/^-\s*\[\s*\]\s*/, '')
      const borderColor = theme === 'dark' ? 'border-zinc-500' : 'border-gray-400'
      html += `<div class="flex items-center gap-2 my-1"><label class="relative flex items-center cursor-not-allowed"><input type="checkbox" disabled class="peer sr-only" /><div class="w-5 h-5 rounded border-2 ${borderColor} bg-transparent flex items-center justify-center"></div></label><span class="${colors.text}">${task}</span></div>\n`
      continue
    }

    // Unordered lists
    if (line.match(/^- /)) {
      html += `<li class="${colors.text} ml-4 list-disc">${line.substring(2)}</li>\n`
      continue
    }

    // Ordered lists
    if (line.match(/^\d+\. /)) {
      const match = line.match(/^(\d+)\. (.*)$/)
      if (match) {
        html += `<li class="${colors.text} ml-4 list-decimal">${match[2]}</li>\n`
        continue
      }
    }

    // Inline code (backticks are already escaped, need to unescape for display)
    const codeBg = theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200'
    const codeText = theme === 'dark' ? 'text-green-400' : 'text-green-600'
    line = line.replace(/&#96;([^&#]+)&#96;/g, `<code class="${codeBg} px-1.5 py-0.5 rounded ${codeText} text-sm">$1</code>`)

    // Bold (double asterisks - need to handle carefully after escaping)
    line = line.replace(/\*\*([^*]+)\*\*/g, `<strong class="font-bold ${colors.text}">$1</strong>`)
    line = line.replace(/__([^_]+)__/g, `<strong class="font-bold ${colors.text}">$1</strong>`)

    // Single asterisk for italic (only if not part of bold)
    line = line.replace(/\*([^*]+)\*/g, `<em class="italic ${colors.textSecondary}">$1</em>`)

    // Strikethrough
    const strikethroughColor = theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'
    line = line.replace(/~~([^~]+)~~/g, `<del class="line-through ${strikethroughColor}">$1</del>`)

    // Images - process after escapeHtml (brackets aren't escaped)
    line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
      const safeUrl = url.match(/^https?:/) ? url : ''
      return safeUrl ? `<img src="${safeUrl}" alt="${alt}" class="max-w-full h-auto my-2 rounded" />` : ''
    })

    // Links - process after escapeHtml (brackets aren't escaped)
    const linkClass = colors.link
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      const safeUrl = url.match(/^(https?:|mailto:|#)/) ? url : '#'
      return `<a href="${safeUrl}" class="${linkClass} underline" target="_blank" rel="noopener">${text}</a>`
    })

    // Regular paragraph
    if (line.trim()) {
      html += `<p class="${colors.text} mb-2">${line}</p>\n`
    }
  }

  // NO sanitization for preview - just return the HTML
  // The input is already escaped above, and this is for presentation only
  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Preserve markdown backticks for inline code detection
    .replace(/`/g, '&#96;')
}