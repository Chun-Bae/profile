'use client'

import { useActionState, useState, useEffect } from 'react'
import { updateProfile } from '@/app/actions'
import { ProfileData } from '@/types/profile'

export default function ProfileEditorModal({ initialProfile }: { initialProfile: ProfileData }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Close the modal when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Floating Edit Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] text-[var(--foreground)] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xl"
        aria-label="Edit Profile"
        title="Edit your profile"
      >
        ✏️
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          
          <div className="w-full sm:w-[500px] md:w-[600px] h-full bg-[var(--background)] border-l border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>⚙️</span> Edit Profile
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
               <AdminFormContent profile={initialProfile} closeModal={() => setIsOpen(false)} />
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}

function AdminFormContent({ profile, closeModal }: { profile: ProfileData, closeModal: () => void }) {
  const [state, action, isPending] = useActionState(updateProfile, undefined)
  const [data, setData] = useState<ProfileData>(profile)

  // Success handling - close modal automatically after a short delay
  useEffect(() => {
     if (state?.success) {
       const timer = setTimeout(() => closeModal(), 1500)
       return () => clearTimeout(timer)
     }
  }, [state?.success, closeModal])

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({
      ...data,
      intro: { ...data.intro, [e.target.name]: e.target.value }
    })
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      intro: {
        ...data.intro,
        socials: { ...data.intro.socials, [e.target.name]: e.target.value }
      }
    })
  }

  const handleJsonSectionChange = (section: keyof ProfileData, value: string) => {
    try {
      const parsed = JSON.parse(value);
      setData({ ...data, [section]: parsed });
    } catch (e) {
      // Just ignore parsing errors while typing, but don't update state
    }
  }

  return (
    <form action={action} className="space-y-8">
      {/* Hidden input to pass the fully constructed JSON to the server action */}
      <input type="hidden" name="profileData" value={JSON.stringify(data)} />

      {state?.error && (
        <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium animate-pulse">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-sm font-medium">
          {state.success}
        </div>
      )}

      {/* Intro Section - Visual UI */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--border)] pb-2 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Name</label>
            <input type="text" name="name" value={data.intro.name} onChange={handleIntroChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Role</label>
            <input type="text" name="role" value={data.intro.role} onChange={handleIntroChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Summary / Bio</label>
            <textarea name="summary" value={data.intro.summary} onChange={handleIntroChange} rows={3} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm resize-y" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
               <label className="text-xs font-semibold text-[var(--text-muted)]">Email</label>
               <input type="email" name="email" value={data.intro.email} onChange={handleIntroChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-semibold text-[var(--text-muted)]">Phone</label>
               <input type="text" name="phone" value={data.intro.phone || ''} onChange={handleIntroChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
             </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Location</label>
            <input type="text" name="location" value={data.intro.location || ''} onChange={handleIntroChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--border)] pb-2 pt-6 mb-4">Images</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Avatar URL</label>
            <input type="text" name="avatarUrl" value={data.intro.avatarUrl || ''} onChange={handleIntroChange} placeholder="https://..." className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm font-mono text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Banner URL</label>
            <input type="text" name="bannerUrl" value={data.intro.bannerUrl || ''} onChange={handleIntroChange} placeholder="https://..." className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm font-mono text-xs" />
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--border)] pb-2 pt-6 mb-4">Social Links</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">GitHub URL</label>
            <input type="text" name="github" value={data.intro.socials?.github || ''} onChange={handleSocialChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">LinkedIn URL</label>
            <input type="text" name="linkedin" value={data.intro.socials?.linkedin || ''} onChange={handleSocialChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)]">Blog URL</label>
            <input type="text" name="blog" value={data.intro.socials?.blog || ''} onChange={handleSocialChange} className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)] rounded-md text-sm" />
          </div>
        </div>
      </div>

      {/* Advanced Array Sections - Textareas for simplicity but sectioned */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] border-b border-[var(--border)] pb-2 pt-6 mb-4">Detailed Content (JSON array format)</h3>
        
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)] flex justify-between">
              <span>Portfolio Projects</span>
              <span className="font-mono opacity-50">[ ... ]</span>
            </label>
            <textarea 
              defaultValue={JSON.stringify(data.portfolio, null, 2)} 
              onChange={(e) => handleJsonSectionChange('portfolio', e.target.value)}
              rows={6} 
              className="w-full font-mono text-[10px] sm:text-xs p-3 bg-zinc-100 dark:bg-zinc-900 border border-[var(--border)] rounded-md" spellCheck="false"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)] flex justify-between">
              <span>Tech Stack</span>
              <span className="font-mono opacity-50">[ ... ]</span>
            </label>
            <textarea 
              defaultValue={JSON.stringify(data.techStack, null, 2)} 
              onChange={(e) => handleJsonSectionChange('techStack', e.target.value)}
              rows={5} 
              className="w-full font-mono text-[10px] sm:text-xs p-3 bg-zinc-100 dark:bg-zinc-900 border border-[var(--border)] rounded-md" spellCheck="false"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-muted)] flex justify-between">
              <span>Certifications & Patents</span>
              <span className="font-mono opacity-50">&#123; ... &#125;</span>
            </label>
             <textarea 
              defaultValue={JSON.stringify({ certifications: data.certifications, patents: data.patents }, null, 2)} 
              onChange={(e) => {
                try {
                  const val = JSON.parse(e.target.value);
                  setData(prev => ({...prev, certifications: val.certifications, patents: val.patents}));
                } catch(e){}
              }}
              rows={5} 
              className="w-full font-mono text-[10px] sm:text-xs p-3 bg-zinc-100 dark:bg-zinc-900 border border-[var(--border)] rounded-md" spellCheck="false"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] pb-6 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] font-bold rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? 'Saving...' : 'Save & Update Site'}
        </button>
      </div>
    </form>
  )
}
