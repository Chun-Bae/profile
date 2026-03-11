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
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!item) return
    setMdContent(null)

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
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  const isOpen = !!item

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <aside
        ref={panelRef}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-[var(--background)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] shrink-0">
          <h2 className="text-xl font-bold text-[var(--foreground)] truncate pr-4">
            {item?.title}
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
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
