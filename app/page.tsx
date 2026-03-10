import { fetchProfile } from "@/lib/fetchProfile";
import ProfileEditor from "@/components/ProfileEditor";

export const revalidate = 60;

export default async function Home() {
  const profile = await fetchProfile();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--accent)] selection:text-white relative">
      <ProfileEditor initialProfile={profile} />
    </div>
  );
}
