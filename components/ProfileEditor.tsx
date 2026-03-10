'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/app/actions'
import { ProfileData } from '@/types/profile'
import { IntroSection, TechStackSection, PortfolioSection, ListSection } from './ProfileSections'

export default function ProfileEditor({ initialProfile }: { initialProfile: ProfileData }) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false)
  
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [introData, setIntroData] = useState(initialProfile.intro)
  const [jsonText, setJsonText] = useState("")
  const [isPending, startTransition] = useTransition()

  const startEdit = (section: string, data: any) => {
    if (section === 'intro') {
      setIntroData(data)
    } else {
      setJsonText(JSON.stringify(data, null, 2))
    }
    setEditingSection(section)
  }

  const cancelEdit = () => {
    setEditingSection(null)
  }

  const saveEdit = (section: keyof ProfileData) => {
    let updatedSectionData;
    if (section === 'intro') {
      updatedSectionData = introData
    } else {
      try {
        updatedSectionData = JSON.parse(jsonText.trim() || '[]')
      } catch (err) {
        alert("Invalid JSON format")
        return
      }
    }

    const newProfile = { ...profile, [section]: updatedSectionData }
    setProfile(newProfile)
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append('profileData', JSON.stringify(newProfile))
      await updateProfile(null, formData)
      setEditingSection(null)
    })
  }

  const EditButton = ({ onClick }: { onClick: () => void }) => {
    if (!isGlobalEditMode) return null;
    return (
      <button 
        onClick={onClick}
        className="absolute top-0 right-0 p-2 md:-right-4 md:-top-4 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-full shadow-md hover:scale-110 transition-transform z-10"
        title="Edit Section"
      >
        ✏️
      </button>
    )
  }

  const EditorActions = ({ onCancel, onSave }: any) => (
    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border)]">
      <button onClick={onCancel} disabled={isPending} className="px-4 py-2 text-sm bg-zinc-200 dark:bg-zinc-800 rounded-md hover:opacity-80">Cancel</button>
      <button onClick={onSave} disabled={isPending} className="px-4 py-2 text-sm bg-[var(--foreground)] text-[var(--background)] rounded-md font-bold hover:opacity-90">
        {isPending ? 'Saving...' : 'Save Section'}
      </button>
    </div>
  )

  const formattedCertifications = profile.certifications?.map(c => ({ title: c.name, subtitle: c.issuer, date: c.date })) || []
  const formattedPatents = profile.patents?.map(p => ({ title: p.title, subtitle: p.number, date: p.date, link: p.link })) || []
  const formattedEnglishScores = profile.englishScores?.map(e => ({ title: e.testName, subtitle: e.score, date: e.date })) || []

  return (
    <>
      {/* Global Edit Mode Toggle */}
      <button 
        onClick={() => {
          setIsGlobalEditMode(!isGlobalEditMode)
          setEditingSection(null)
        }}
        className={`fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full shadow-xl hover:scale-105 transition-all font-bold tracking-wide flex items-center gap-2 ${
          isGlobalEditMode 
            ? 'bg-amber-500 text-white border border-amber-400' 
            : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-[var(--border)]'
        }`}
        title="Toggle Edit Mode"
      >
        {isGlobalEditMode ? '👁️ View Mode' : '✏️ Edit Mode'}
      </button>

      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-16">
        
        {/* Intro */}
        <div className="relative group">
          {editingSection === 'intro' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-4">Edit Intro</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div><label className="text-xs text-[var(--text-muted)]">Name</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.name} onChange={e=>setIntroData({...introData, name: e.target.value})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Role</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.role} onChange={e=>setIntroData({...introData, role: e.target.value})}/></div>
                 <div className="sm:col-span-2"><label className="text-xs text-[var(--text-muted)]">Summary</label><textarea rows={3} className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.summary} onChange={e=>setIntroData({...introData, summary: e.target.value})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Email</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.email} onChange={e=>setIntroData({...introData, email: e.target.value})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Phone</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.phone || ''} onChange={e=>setIntroData({...introData, phone: e.target.value})}/></div>
                 <div className="sm:col-span-2"><label className="text-xs text-[var(--text-muted)]">Location</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.location || ''} onChange={e=>setIntroData({...introData, location: e.target.value})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Avatar URL</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.avatarUrl || ''} onChange={e=>setIntroData({...introData, avatarUrl: e.target.value})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Banner URL</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.bannerUrl || ''} onChange={e=>setIntroData({...introData, bannerUrl: e.target.value})}/></div>
                 
                 <div className="sm:col-span-2 mt-4 border-b border-[var(--border)] pb-2"><h4 className="text-sm font-bold">Socials</h4></div>
                 <div><label className="text-xs text-[var(--text-muted)]">GitHub</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.github || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, github: e.target.value}})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">LinkedIn</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.linkedin || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, linkedin: e.target.value}})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Blog</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.blog || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, blog: e.target.value}})}/></div>
               </div>
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('intro')} />
            </div>
          ) : (
            <>
              <IntroSection intro={profile.intro} />
              <EditButton onClick={() => startEdit('intro', profile.intro)} />
            </>
          )}
        </div>
        
        <hr className="prose-hr" />

        {/* Tech Stack */}
        <div className="relative group">
          {editingSection === 'techStack' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Technical Skills (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('techStack')} />
            </div>
          ) : (
            (profile.techStack?.length > 0 || isGlobalEditMode) && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                  Technical Skills
                  <EditButton onClick={() => startEdit('techStack', profile.techStack || [])} />
                </h2>
                {profile.techStack?.length > 0 ? (
                  <TechStackSection stack={profile.techStack} />
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">No skills added yet.</p>
                )}
              </div>
            )
          )}
        </div>

        {/* Portfolio */}
        <div className="relative group mt-16">
          {editingSection === 'portfolio' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Projects (JSON array)</h3>
               <textarea className="w-full h-64 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('portfolio')} />
            </div>
          ) : (
            (profile.portfolio?.length > 0 || isGlobalEditMode) && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                  Projects
                  <EditButton onClick={() => startEdit('portfolio', profile.portfolio || [])} />
                </h2>
                {profile.portfolio?.length > 0 ? (
                  <PortfolioSection items={profile.portfolio} />
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">No projects added yet.</p>
                )}
              </div>
            )
          )}
        </div>

        {/* Certifications */}
        <div className="relative group mt-16">
          {editingSection === 'certifications' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Certifications (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('certifications')} />
            </div>
          ) : (
            (formattedCertifications.length > 0 || isGlobalEditMode) && (
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                   Certifications
                   <EditButton onClick={() => startEdit('certifications', profile.certifications || [])} />
                 </h2>
                 {formattedCertifications.length > 0 ? (
                   <ListSection items={formattedCertifications} />
                 ) : (
                   <p className="text-sm text-[var(--text-muted)] italic">No certifications added yet.</p>
                 )}
              </div>
            )
          )}
        </div>
        
        {/* Patents */}
        <div className="relative group mt-16">
          {editingSection === 'patents' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Patents (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('patents')} />
            </div>
          ) : (
            (formattedPatents.length > 0 || isGlobalEditMode) && (
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                   Patents
                   <EditButton onClick={() => startEdit('patents', profile.patents || [])} />
                 </h2>
                 {formattedPatents.length > 0 ? (
                   <ListSection items={formattedPatents} />
                 ) : (
                   <p className="text-sm text-[var(--text-muted)] italic">No patents added yet.</p>
                 )}
              </div>
            )
          )}
        </div>

        {/* Language Scores */}
        <div className="relative group mt-16">
          {editingSection === 'englishScores' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Language Scores (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('englishScores')} />
            </div>
          ) : (
            (formattedEnglishScores.length > 0 || isGlobalEditMode) && (
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                   Language Scores
                   <EditButton onClick={() => startEdit('englishScores', profile.englishScores || [])} />
                 </h2>
                 {formattedEnglishScores.length > 0 ? (
                   <ListSection items={formattedEnglishScores} />
                 ) : (
                   <p className="text-sm text-[var(--text-muted)] italic">No language scores added yet.</p>
                 )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <footer className="pt-12 mt-24 border-t border-[var(--border)] text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
           <p>Copyright © {new Date().getFullYear()} Chun-Bae. All rights reserved.</p>
        </footer>
      </main>
    </>
  )
}
