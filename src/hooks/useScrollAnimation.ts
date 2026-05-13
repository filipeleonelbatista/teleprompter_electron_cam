import { useEffect, useRef, useCallback } from 'react'

interface UseScrollAnimationOptions {
  isPlaying: boolean
  scrollSpeed: number
  onProgressChange: (progress: number) => void
  onComplete: () => void
}

export function useScrollAnimation({
  isPlaying,
  scrollSpeed,
  onProgressChange,
  onComplete,
}: UseScrollAnimationOptions) {
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopScroll = useCallback(() => {
    if (scrollRef.current) {
      clearInterval(scrollRef.current)
      scrollRef.current = null
    }
  }, [])

  const resetScroll = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
    onProgressChange(0)
  }, [onProgressChange])

  useEffect(() => {
    if (!isPlaying) {
      stopScroll()
      return
    }

    resetScroll()

    scrollRef.current = setInterval(() => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const max = scrollHeight - clientHeight
      const step = scrollSpeed / 10

      if (scrollTop < max) {
        contentRef.current.scrollTop += step
        const progress = max > 0 ? (contentRef.current.scrollTop / max) * 100 : 0
        onProgressChange(progress)
      } else {
        onProgressChange(100)
        stopScroll()
        onComplete()
      }
    }, 50)

    return () => {
      stopScroll()
    }
  }, [isPlaying, scrollSpeed, onProgressChange, onComplete, stopScroll, resetScroll])

  return {
    contentRef,
    resetScroll,
  }
}