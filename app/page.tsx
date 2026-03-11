import { fetchProfile } from "@/lib/fetchProfile";
import ProfileEditor from "@/components/ProfileEditor";

export const revalidate = 60;

export default async function Home() {
  const [profileKO, profileEN] = await Promise.all([
    fetchProfile('ko'),
    fetchProfile('en')
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--accent)] selection:text-white relative">
      <ProfileEditor initialProfileKO={profileKO} initialProfileEN={profileEN} />
    </div>
  );
}
