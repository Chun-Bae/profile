import { ProfileData } from "@/types/profile";

export function IntroSection({ intro }: { intro: ProfileData["intro"] }) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)]">
          {intro.name}
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium text-[var(--text-muted)]">
          {intro.role}
        </h2>
      </div>

      <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)]">
        {intro.summary}
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-muted)] mt-6">
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
              <a href={intro.socials.github} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-[var(--accent)] hover:underline">
                GitHub ↗
              </a>
            )}
            {intro.socials.linkedin && (
              <a href={intro.socials.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-[var(--accent)] hover:underline">
                LinkedIn ↗
              </a>
            )}
            {intro.socials.blog && (
              <a href={intro.socials.blog} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-[var(--accent)] hover:underline">
                Blog ↗
              </a>
            )}
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
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{group.category}</h3>
          <p className="text-[var(--foreground)] leading-relaxed">
            {group.skills.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PortfolioSection({ items }: { items: ProfileData["portfolio"] }) {
  return (
    <div className="space-y-12">
      {items.map((item, i) => (
        <article key={i} className="group">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2 gap-1">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              {item.title}
            </h3>
            <time className="text-sm text-[var(--text-muted)] whitespace-nowrap">{item.date}</time>
          </div>
          
          <p className="text-[var(--foreground)] leading-relaxed mb-4">
            {item.description}
          </p>
          
          <div className="mb-4">
            <strong className="text-sm font-semibold text-[var(--foreground)] mr-2">Built with:</strong>
            <span className="text-sm text-[var(--text-muted)]">
              {item.technologies.join(", ")}
            </span>
          </div>

          <div className="flex gap-4 text-sm font-medium">
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
