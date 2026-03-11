import { ProfileData } from "@/types/profile";

export function IntroSection({ intro }: { intro: ProfileData["intro"] }) {
  return (
    <section className="space-y-6">
      {(intro.bannerUrl || intro.avatarUrl) && (
        <div className="relative mb-20 sm:mb-24">
          {intro.bannerUrl ? (
            <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-[var(--border)]">
              <img src={intro.bannerUrl} alt="Cover banner" className="w-full h-full object-cover" />
            </div>
          ) : (
             <div className="h-16" /> /* Spacing if only avatar exists */
          )}
          
          {intro.avatarUrl && (
            <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[var(--background)] overflow-hidden bg-[var(--background)] shadow-sm ${intro.bannerUrl ? 'absolute -bottom-14 sm:-bottom-18 left-4 sm:left-8' : 'static'}`}>
              <img src={intro.avatarUrl} alt="Profile avatar" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2 mt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          {intro.name}
        </h1>
        <h2 className="text-lg sm:text-xl font-medium text-[var(--text-muted)]">
          {intro.role}
        </h2>
      </div>

      <p className="text-sm sm:text-base leading-relaxed text-[var(--foreground)]">
        {intro.summary}
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-[var(--text-muted)] mt-6">
        {intro.location && (
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📍</span> {intro.location}
          </span>
        )}
        <a href={`mailto:${intro.email}`} className="flex items-center gap-1 hover:text-[var(--accent)] hover:underline transition-colors">
          <span aria-hidden="true">✉️</span> {intro.email}
        </a>
        {intro.phone && (
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📱</span> {intro.phone}
          </span>
        )}
      </div>
      
      {/* Social Links */}
      {intro.socials && Object.values(intro.socials).some(Boolean) && (
         <div className="flex gap-4 pt-4">
            {intro.socials.github && (
              <a href={intro.socials.github} target="_blank" rel="noreferrer" className="text-[var(--foreground)] hover:opacity-80 transition-opacity" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
            {intro.socials.linkedin && (
              <a href={intro.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            )}
            {intro.socials.blog && (
              <a href={intro.socials.blog} target="_blank" rel="noreferrer" className="text-[#f48024] hover:opacity-80 transition-opacity" aria-label="Blog">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></svg>
              </a>
            )}
         </div>
      )}

      {/* Motto */}
      {intro.motto && (
        <div className="pt-8 mb-4 text-center">
          <p className="italic text-base text-[var(--text-muted)]">
            "{intro.motto}"
          </p>
        </div>
      )}
    </section>
  );
}

export function TechStackSection({ stack }: { stack: ProfileData["techStack"] }) {
  return (
    <div className="space-y-6">
      {stack.map((group, i) => (
        <div key={i}>
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">{group.category}</h3>
          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill, j) => (
              <span key={j} className="px-2.5 py-1 text-sm font-medium border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] rounded-md shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioSection({ items }: { items: ProfileData["portfolio"] }) {
  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <article key={i} className="flex flex-col h-full border border-[var(--border)] rounded-xl p-6 bg-[var(--background)] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-xl font-bold text-[var(--foreground)] leading-tight">
              {item.title}
            </h3>
            <time className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap bg-zinc-100 dark:bg-zinc-800/50 border border-[var(--border)] px-2 py-1 rounded-md">
              {item.date}
            </time>
          </div>
          
          <p className="text-[var(--text-muted)] leading-relaxed mb-6 flex-grow">
            {item.description}
          </p>
          
          <div className="mt-auto space-y-5">
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech, j) => (
                <span key={j} className="px-2 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800/50 text-[var(--foreground)] rounded-md border border-[var(--border)]">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-sm font-medium pt-4 border-t border-[var(--border)]">
              {item.link && (
                <a href={item.link} target="_blank" rel="noreferrer" className="prose-link flex items-center gap-1">
                  Live Demo ↗
                </a>
              )}
              {item.github && (
                <a href={item.github} target="_blank" rel="noreferrer" className="prose-link flex items-center gap-1">
                  Source Code ↗
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ListSection({ items }: { items: { title: string, subtitle: string, date: string, link?: string }[] }) {
  return (
    <ul className="space-y-6 list-none p-0 m-0">
      {items.map((item, i) => (
        <li key={i} className="border-l-2 border-[var(--border)] pl-4 py-1">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
             <h3 className="text-lg font-bold text-[var(--foreground)]">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-[var(--accent)] hover:underline">
                    {item.title} ↗
                  </a>
                ) : (
                  item.title
                )}
             </h3>
             <time className="text-sm text-[var(--text-muted)] whitespace-nowrap">{item.date}</time>
           </div>
           <p className="text-[var(--foreground)]">{item.subtitle}</p>
        </li>
      ))}
    </ul>
  );
}

export function AwardSection({ items }: { items: ProfileData["awards"] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-6 list-none p-0 m-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-start">
          <div className="mt-2 flex-none w-2 h-2 rounded-full border-[1.5px] border-[var(--text-muted)] bg-transparent" />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
              <h3 className="text-lg font-bold text-[var(--foreground)]">{item.title}</h3>
              <time className="text-sm text-[var(--text-muted)] whitespace-nowrap">{item.date}</time>
            </div>
            {item.organization && <p className="text-[var(--foreground)] font-medium">{item.organization}</p>}
            {item.description && <p className="text-sm text-[var(--text-muted)] mt-1">{item.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EducationSection({ items }: { items: ProfileData["educations"] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-4 list-none p-0 m-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-start border border-[var(--border)] rounded-xl p-5 bg-[var(--background)] shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-bold text-[var(--foreground)]">{item.schoolName}</h3>
              <div className="flex items-center gap-3 text-sm">
                <span className={`font-semibold ${item.status === '재학' || item.status === 'Attending' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{item.status}</span>
                <time className="text-[var(--text-muted)] font-medium bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded-md">{item.date}</time>
              </div>
            </div>
            {item.gpa && <p className="text-sm text-[var(--foreground)] mt-3 flex items-center gap-2"><span className="font-bold text-[var(--text-muted)]">GPA</span> {item.gpa}</p>}
            {item.notes && <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{item.notes}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
