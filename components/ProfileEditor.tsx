'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, checkPassword, uploadImage } from '@/app/actions'
import { ProfileData } from '@/types/profile'
import { IntroSection, TechStackSection, PortfolioSection, ListSection, AwardSection, EducationSection } from './ProfileSections'
import { useTheme } from 'next-themes'

export default function ProfileEditor({ initialProfileKO, initialProfileEN }: { initialProfileKO: ProfileData, initialProfileEN: ProfileData }) {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<'ko' | 'en'>('ko')
  const [profileKO, setProfileKO] = useState<ProfileData>(initialProfileKO)
  const [profileEN, setProfileEN] = useState<ProfileData>(initialProfileEN)
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const profile = currentLang === 'ko' ? profileKO : profileEN
  const setProfile = currentLang === 'ko' ? setProfileKO : setProfileEN

  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false)
  
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [introData, setIntroData] = useState(profile.intro)
  const [jsonText, setJsonText] = useState("")
  
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  
  const [activeSection, setActiveSection] = useState<string>('intro')

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    
    // Select all our profile sections
    const sections = document.querySelectorAll('main > div[id]');
    sections.forEach((section) => observer.observe(section));
    
    return () => observer.disconnect();
  }, [mounted, profile]);

  const handleToggleClick = () => {
    if (isGlobalEditMode) {
      setIsGlobalEditMode(false)
      setEditingSection(null)
    } else {
      setShowPasswordPrompt(true)
      setPasswordError(false)
      setPasswordInput('')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    const isValid = await checkPassword(passwordInput)
    setIsVerifying(false)

    if (isValid) {
      setShowPasswordPrompt(false)
      setIsGlobalEditMode(true)
    } else {
      setPasswordError(true)
    }
  }

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingBanner(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await uploadImage(formData);

    if (type === 'avatar') setIsUploadingAvatar(false);
    else setIsUploadingBanner(false);

    if (res?.error) {
      alert(res.error);
    } else {
      const currentUrl = type === 'avatar' ? introData.avatarUrl : introData.bannerUrl;
      const baseUrl = currentUrl ? currentUrl.split('?')[0] : '';
      if (baseUrl) {
         const newUrl = baseUrl + '?t=' + Date.now();
         const updatedProfile = {
           ...profile,
           intro: { ...profile.intro, [type + 'Url']: newUrl }
         };
         const saveResForm = new FormData();
         saveResForm.append('profileData', JSON.stringify(updatedProfile));
         saveResForm.append('lang', currentLang);
         await updateProfile(null, saveResForm);
         setProfile(updatedProfile);
         setIntroData(updatedProfile.intro);
      }
      alert(`성공적으로 업로드되었습니다!`);
      router.refresh();
    }
  }

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
      formData.append('lang', currentLang)
      const res = await updateProfile(null, formData)
      
      if (res?.error) {
        alert("저장 실패: " + res.error)
        // Revert optimistic update
        setProfile(profile)
      } else {
        setEditingSection(null)
      }
    })
  }

  const EditButton = ({ onClick }: { onClick: () => void }) => {
    if (!isGlobalEditMode) return null;
    return (
      <button 
        onClick={onClick}
        className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-transform z-10"
        title="Edit Section"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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
  const formattedPatents = profile.patents?.map(p => ({ title: p.title, subtitle: p.number, date: p.date, link: p.link, category: p.category })) || []
  const formattedEnglishScores = profile.englishScores?.map(e => ({ title: e.testName, subtitle: e.score, date: e.date })) || []

  return (
    <>
      {/* Global Edit Mode Toggle */}
      <button 
        onClick={handleToggleClick}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-xl transition-all z-20 hover:scale-105 active:scale-95 ${
          isGlobalEditMode 
            ? 'bg-amber-500 text-white border border-amber-400' 
            : 'bg-zinc-900 dark:bg-zinc-100 text-[var(--background)] border border-[var(--border)]'
        }`}
        title="Toggle Edit Mode"
        aria-label="Toggle Edit Mode"
      >
        {isGlobalEditMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
        )}
      </button>

      {/* Top Controls: Theme & Language */}
      <div className="fixed top-4 sm:top-8 right-4 sm:right-8 z-50 flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-[var(--background)] border border-[var(--border)] shadow-sm text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {mounted && theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : mounted ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : <div className="w-5 h-5" />}
        </button>

        {/* Language Toggle */}
        <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-lg overflow-hidden shadow-sm">
        <button 
          onClick={() => { setCurrentLang('ko'); setEditingSection(null); }}
          className={`px-4 py-2 text-sm font-bold transition-colors ${currentLang === 'ko' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
        >
          KR
        </button>
        <button 
          onClick={() => { setCurrentLang('en'); setEditingSection(null); }}
          className={`px-4 py-2 text-sm font-bold transition-colors ${currentLang === 'en' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'text-[var(--text-muted)] hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
        >
          EN
        </button>
        </div>
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <form onSubmit={handlePasswordSubmit} className="bg-[var(--background)] p-6 rounded-2xl shadow-2xl border border-[var(--border)] max-w-sm w-full mx-4 animate-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Enter Password
            </h2>
            <div className="space-y-4">
              <input 
                type="password" 
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter site password"
                className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              {passwordError && (
                <p className="text-red-500 text-xs font-semibold">Incorrect password</p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordPrompt(false)}
                  className="px-4 py-2 text-sm bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isVerifying || !passwordInput}
                  className="px-4 py-2 text-sm bg-[var(--foreground)] text-[var(--background)] font-bold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Unlock'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="w-full max-w-[90rem] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_minmax(auto,48rem)_1fr] px-4 sm:px-6 gap-8 relative">
        <aside className="hidden xl:block relative">
          <nav className="sticky top-24 flex flex-col gap-3 pt-28 pb-8 pr-4 text-sm text-[var(--text-muted)] w-40 ml-auto mr-6 2xl:mr-16 items-end">
            {[
              { id: 'intro', ko: '소개', en: 'Intro' },
              { id: 'techStack', ko: '기술 스택', en: 'Skills' },
              { id: 'portfolio', ko: '프로젝트', en: 'Projects' },
              { id: 'awards', ko: '수상/대회', en: 'Awards' },
              { id: 'certifications', ko: '자격증', en: 'Certifications' },
              { id: 'patents', ko: '특허 및 등록증', en: 'Patents & Registrations' },
              { id: 'englishScores', ko: '어학 점수', en: 'Language Scores' },
              { id: 'educations', ko: '학력', en: 'Education' },
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className={`transition-all text-right ${activeSection === item.id ? 'text-[var(--foreground)] -translate-x-1 font-bold' : 'hover:text-[var(--foreground)] hover:-translate-x-1'}`}
              >
                {currentLang === 'ko' ? item.ko : item.en}
              </a>
            ))}
          </nav>
        </aside>

        <main className="w-full min-w-0 py-16 sm:py-24 space-y-16">
          
          {/* Intro */}
          <div className="relative group scroll-mt-24" id="intro">
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
                 <div className="sm:col-span-2">
                   <label className="text-xs text-[var(--text-muted)] block mb-1">Avatar Image</label>
                   <label className="cursor-pointer inline-flex items-center justify-center border border-[var(--border)] rounded px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap">
                     {isUploadingAvatar ? <span className="animate-pulse">Uploading...</span> : 'Upload New Avatar 📤'}
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar')} />
                   </label>
                 </div>
                 <div className="sm:col-span-2">
                   <label className="text-xs text-[var(--text-muted)] block mb-1">Banner Image</label>
                   <label className="cursor-pointer inline-flex items-center justify-center border border-[var(--border)] rounded px-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors whitespace-nowrap">
                     {isUploadingBanner ? <span className="animate-pulse">Uploading...</span> : 'Upload New Banner 📤'}
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'banner')} />
                   </label>
                 </div>
                 
                 <div className="sm:col-span-2 mt-4 border-b border-[var(--border)] pb-2"><h4 className="text-sm font-bold">Socials</h4></div>
                 <div><label className="text-xs text-[var(--text-muted)]">GitHub</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.github || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, github: e.target.value}})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">LinkedIn</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.linkedin || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, linkedin: e.target.value}})}/></div>
                 <div><label className="text-xs text-[var(--text-muted)]">Blog</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none" value={introData.socials?.blog || ''} onChange={e=>setIntroData({...introData, socials: {...introData.socials, blog: e.target.value}})}/></div>

                 <div className="sm:col-span-2 mt-4 border-b border-[var(--border)] pb-2"><h4 className="text-sm font-bold">Motto</h4></div>
                 <div className="sm:col-span-2"><label className="text-xs text-[var(--text-muted)]">Motto Statement</label><input className="w-full border border-[var(--border)] rounded px-3 py-2 text-sm bg-white dark:bg-zinc-950 outline-none italic" value={introData.motto || ''} onChange={e=>setIntroData({...introData, motto: e.target.value})} placeholder="e.g. Keep moving forward..."/></div>
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

        {/* Tech Stack */}
        <div className="relative group scroll-mt-24" id="techStack">
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
                  {currentLang === 'ko' ? '기술 스택' : 'Technical Skills'}
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
        <div className="relative group mt-16 scroll-mt-24" id="portfolio">
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
                  {currentLang === 'ko' ? '프로젝트' : 'Projects'}
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

        {/* Awards/Competitions */}
        <div className="relative group mt-16 scroll-mt-24" id="awards">
          {editingSection === 'awards' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Awards/Competitions (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('awards')} />
            </div>
          ) : (
            ((profile.awards && profile.awards.length > 0) || isGlobalEditMode) && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                  {currentLang === 'ko' ? '수상 및 대회' : 'Awards & Competitions'}
                  <EditButton onClick={() => startEdit('awards', profile.awards || [])} />
                </h2>
                {profile.awards && profile.awards.length > 0 ? (
                  <AwardSection items={profile.awards} />
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">No awards or competitions added yet.</p>
                )}
              </div>
            )
          )}
        </div>
        {/* Certifications */}
        <div className="relative group mt-16 scroll-mt-24" id="certifications">
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
                   {currentLang === 'ko' ? '자격증' : 'Certifications'}
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
        <div className="relative group mt-16 scroll-mt-24" id="patents">
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
                   {currentLang === 'ko' ? '특허 및 등록증' : 'Patents & Registrations'}
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
        <div className="relative group mt-16 scroll-mt-24" id="englishScores">
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
                   {currentLang === 'ko' ? '어학 점수' : 'Language Scores'}
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

        {/* Education */}
        <div className="relative group mt-16 scroll-mt-24" id="educations">
          {editingSection === 'educations' ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-[var(--border)] animate-in fade-in zoom-in-95">
               <h3 className="text-lg font-bold mb-2">Edit Education (JSON array)</h3>
               <textarea className="w-full h-48 border border-[var(--border)] rounded p-3 font-mono text-xs bg-white dark:bg-zinc-950 outline-none resize-y" value={jsonText} onChange={e => setJsonText(e.target.value)} spellCheck={false} />
               <EditorActions onCancel={cancelEdit} onSave={() => saveEdit('educations')} />
            </div>
          ) : (
            ((profile.educations && profile.educations.length > 0) || isGlobalEditMode) && (
              <div className="space-y-8">
                 <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2 relative">
                   {currentLang === 'ko' ? '학력' : 'Education'}
                   <EditButton onClick={() => startEdit('educations', profile.educations || [])} />
                 </h2>
                 {profile.educations && profile.educations.length > 0 ? (
                   <EducationSection items={profile.educations} />
                 ) : (
                   <p className="text-sm text-[var(--text-muted)] italic">No education added yet.</p>
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
      </div>
    </>
  )
}
