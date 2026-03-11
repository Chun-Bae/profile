'use client'

import { useEffect, useState, useRef } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { PortfolioItem } from '@/types/profile'

interface ProjectDetailPanelProps {
  item: PortfolioItem | null
  onClose: () => void
}

// ─── Copy-capable code block ───────────────────────────────────────────────
function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-zinc-700 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-700"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-green-400">복사완료!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              복사
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.85rem',
          lineHeight: '1.6',
          background: '#1a1b1e',
        }}
        codeTagProps={{ style: { background: 'transparent' } }}
        showLineNumbers
        lineNumberStyle={{ color: '#4b5563', minWidth: '2.5em', userSelect: 'none' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

// ─── Markdown component map ────────────────────────────────────────────────
const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-extrabold text-[var(--foreground)] mt-8 mb-4 pb-3 border-b border-[var(--border)] tracking-tight leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-[var(--foreground)] mt-8 mb-3 tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-[var(--foreground)] mt-6 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-[var(--foreground)] mt-4 mb-1">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-[var(--foreground)] leading-7 mb-4 text-[15px]">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer"
      className="text-[var(--accent)] underline underline-offset-2 hover:opacity-75 transition-opacity">
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 space-y-1.5 pl-2 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 space-y-1.5 pl-5 list-decimal marker:text-[var(--text-muted)]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[var(--foreground)] text-[15px] leading-7 flex gap-2 items-start">
      <span className="mt-2.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]" />
      <span className="flex-1">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 pl-4 border-l-4 border-[var(--accent)] bg-zinc-50 dark:bg-zinc-900/60 rounded-r-lg py-3 pr-4 text-[var(--text-muted)] italic text-[15px]">
      {children}
    </blockquote>
  ),
  // code: block & inline
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    if (match) {
      return (
        <CodeBlock language={match[1]}>
          {String(children).replace(/\n$/, '')}
        </CodeBlock>
      )
    }
    // Inline code — red
    return (
      <code
        className="px-1.5 py-0.5 text-sm font-mono bg-zinc-100 dark:bg-zinc-800/80 text-red-500 rounded border border-zinc-200 dark:border-zinc-700"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-[var(--foreground)] font-semibold text-xs uppercase tracking-wider">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-[var(--border)]">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">{children}</tr>
  ),
  th: ({ children }) => <th className="px-4 py-3 text-[var(--text-muted)]">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3 text-[var(--foreground)]">{children}</td>,
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  // Images – use plain <img> so any external URL (OCI bucket etc.) works
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      referrerPolicy="no-referrer"
      className="my-6 w-full rounded-xl border border-[var(--border)] shadow-sm object-cover"
    />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[var(--foreground)]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[var(--text-muted)]">{children}</em>
  ),
}

// ─── Main Component ────────────────────────────────────────────────────────
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
      fetch(item.mdFile, { cache: 'no-store' })
        .then(res => res.ok ? res.text() : null)
        .then(text => { setMdContent(text); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [item])

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

  useEffect(() => {
    if (item) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [item])

  const isOpen = !!item
  const panelWidth = isFullscreen ? 'w-full' : 'w-full max-w-4xl'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => { if (isFullscreen) setIsFullscreen(false); else onClose() }}
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
            <button
              onClick={() => setIsFullscreen(f => !f)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
              title={isFullscreen ? '사이드 패널로 보기 (ESC)' : '전체 화면으로 보기'}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
              title="닫기 (ESC)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto py-8 ${isFullscreen ? 'px-8 md:px-24 lg:px-48 xl:px-72' : 'px-6 md:px-10'}`}>
          {item && (
            <div className="mb-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-muted)]">
                  📅 {item.date}
                </span>
                {item.technologies.map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-[var(--border)] text-[var(--foreground)] font-medium">
                    {t}
                  </span>
                ))}
              </div>
              {(item.link || item.github || (item.sourceLinks && item.sourceLinks.length > 0)) && (
                <div className="flex gap-3 flex-wrap">
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 transition-opacity text-xs font-bold">
                      Live Demo ↗
                    </a>
                  )}
                  {item.github && (
                    <a href={item.github} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-bold">
                      Source Code ↗
                    </a>
                  )}
                  {item.sourceLinks?.map((link, k) => (
                    <a key={k} href={link.url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-bold">
                      {link.name} ↗
                    </a>
                  ))}
                </div>
              )}
              <hr className="border-[var(--border)]" />
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] py-12 justify-center">
              <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
              불러오는 중...
            </div>
          )}

          {!loading && mdContent && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={mdComponents}
            >
              {mdContent}
            </ReactMarkdown>
          )}

          {!loading && !mdContent && item && (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-sm italic">
                {item.mdFile ? 'MD 파일을 불러올 수 없습니다.' : '상세 설명 파일이 연결되지 않았습니다.'}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
