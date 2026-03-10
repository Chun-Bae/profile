import { fetchProfile } from "@/lib/fetchProfile";
import { IntroSection, TechStackSection, PortfolioSection, ListSection } from "@/components/ProfileSections";
import { Patent, Certification, EnglishScore } from "@/types/profile";

export const revalidate = 60;

export default async function Home() {
  const profile = await fetchProfile();

  const formattedCertifications = profile.certifications.map((c: Certification) => ({
    title: c.name,
    subtitle: c.issuer,
    date: c.date,
  }));

  const formattedPatents = profile.patents.map((p: Patent) => ({
    title: p.title,
    subtitle: p.number,
    date: p.date,
    link: p.link,
  }));

  const formattedEnglishScores = profile.englishScores.map((e: EnglishScore) => ({
    title: e.testName,
    subtitle: e.score,
    date: e.date,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--accent)] selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-16">
        
        {/* Intro Section */}
        <IntroSection intro={profile.intro} />

        <hr className="prose-hr" />

        {/* Tech Stack Section */}
        {profile.techStack?.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2">Technical Skills</h2>
            <TechStackSection stack={profile.techStack} />
          </div>
        )}

        {/* Portfolio Section */}
        {profile.portfolio?.length > 0 && (
          <div className="space-y-8 mt-16">
            <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2">Projects</h2>
            <PortfolioSection items={profile.portfolio} />
          </div>
        )}

        {/* Other Details */}
        <div className="space-y-16 mt-16">
          {profile.certifications?.length > 0 && (
            <div className="space-y-8">
               <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2">Certifications</h2>
               <ListSection items={formattedCertifications} />
            </div>
          )}
          
          {profile.patents?.length > 0 && (
            <div className="space-y-8">
               <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2">Patents</h2>
               <ListSection items={formattedPatents} />
            </div>
          )}

          {profile.englishScores?.length > 0 && (
            <div className="space-y-8">
               <h2 className="text-2xl font-bold tracking-tight border-b border-[var(--border)] pb-2">Language Scores</h2>
               <ListSection items={formattedEnglishScores} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="pt-12 mt-24 border-t border-[var(--border)] text-[var(--text-muted)] text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
           <p>© {new Date().getFullYear()} {profile.intro.name}.</p>
           <p>Generated dynamically from JSON.</p>
        </footer>
      </main>
    </div>
  );
}
