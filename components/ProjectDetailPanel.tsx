'use client'

import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PortfolioItem } from '@/types/profile'

interface ProjectDetailPanelProps {
  item: PortfolioItem | null
  onClose: () => void
}

export default function ProjectDetailPanel({ item, onClose }: ProjectDetailPanelProps) {
  const [mdContent, setMdContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!item) return
    setMdContent(null)
    setIsFullscreen(false)

    if (item.mdFile) {
      setLoading(true)
      // mdFile은 전체 URL (오라클 버킷, GitHub Raw 등)
      fetch(item.mdFile)
        .then(res => res.ok ? res.text() : null)
        .then(text => { setMdContent(text); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [item])

  // ESC key to close
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose, isFullscreen])

  // Prevent body scroll when open
  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  const isOpen = !!item

  // width: side panel = max-w-4xl, fullscreen = 100vw
  const panelWidth = isFullscreen ? 'w-full' : 'w-full max-w-4xl'

  return (
    <>
      {/* Backdrop — fullscreen에서는 더 어둡게 */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => { if (isFullscreen) setIsFullscreen(false); else onClose(); }}
      />

      {/* Side Panel */}
      <aside
        ref={panelRef}
        className={`fixed top-0 right-0 z-50 h-full ${panelWidth} bg-[var(--background)] shadow-2xl flex flex-col transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0 gap-3">
          <h2 className="text-xl font-bold text-[var(--foreground)] truncate flex-1">
            {item?.title}
          </h2>

          <div className="flex items-center gap-1 shrink-0">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
              aria-label={isFullscreen ? '사이드 패널로 보기' : '전체 화면으로 보기'}
              title={isFullscreen ? '사이드 패널로 보기' : '전체 화면으로 보기'}
            >
              {isFullscreen ? (
                // Compress icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              ) : (
                // Expand icon
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
              aria-label="닫기"
              title="닫기 (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto py-6 space-y-6 ${isFullscreen ? 'px-12 md:px-24 lg:px-40 xl:px-60' : 'px-6 md:px-10'}`}>
          {/* Meta: Date + Tags */}
          {item && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md border border-[var(--border)] text-[var(--text-muted)]">
                  {item.date}
                </span>
                {item.technologies.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)] text-[var(--foreground)]">
                    {t}
                  </span>
                ))}
              </div>

              {/* Quick Links */}
              {(item.link || item.github) && (
                <div className="flex gap-4 text-sm font-medium">
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent)] hover:underline">
                      Live Demo ↗
                    </a>
                  )}
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[var(--accent)] hover:underline">
                      Source Code ↗
                    </a>
                  )}
                </div>
              )}

              {/* Divider */}
              <hr className="border-[var(--border)]" />
            </>
          )}

          {/* MD Content */}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              불러오는 중...
            </div>
          )}

          {!loading && mdContent && (
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[var(--accent)] prose-code:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mdContent}
              </ReactMarkdown>
            </article>
          )}

          {!loading && !mdContent && item && (
            <p className="text-sm text-[var(--text-muted)] italic">
              {item.mdFile ? 'MD 파일을 불러올 수 없습니다.' : '상세 설명 파일이 연결되지 않았습니다.'}
            </p>
          )}
        </div>
      </aside>
    </>
  )
}
