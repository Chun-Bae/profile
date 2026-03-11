import { ProfileData } from "../types/profile";

const defaultProfile: ProfileData = {
  intro: {
    name: "User Name",
    role: "Role",
    summary: "No profile data found. Please set up your profile via the Admin settings.",
    email: "example@example.com",
    socials: {}
  },
  techStack: [],
  portfolio: [],
  certifications: [],
  patents: [],
  englishScores: []
};

export async function fetchProfile(lang: 'ko' | 'en' = 'ko'): Promise<ProfileData> {
  const bucketUrl = process.env.OCI_BUCKET_READ_URL || process.env.OCI_BUCKET_URL;

  if (bucketUrl) {
    const filename = `profile_${lang}.json`;
    const ociUrl = bucketUrl.endsWith('/') ? `${bucketUrl}${filename}` : `${bucketUrl}/${filename}`;
    try {
      const res = await fetch(ociUrl, {
        next: { revalidate: 0 }, // For faster refresh during edit or we can keep 60
        cache: 'no-store'
      });
      if (res.ok) {
        return res.json() as Promise<ProfileData>;
      } else {
        console.warn(`Failed to fetch ${lang} profile from OCI (Status: ${res.status}). Returning default.`);
      }
    } catch (error) {
      console.error(`Error fetching ${lang} profile from OCI URL:`, error);
    }
  } else {
    console.warn(`OCI_BUCKET_READ_URL is not set.`);
  }

  // Fallback to empty default data so the admin page can still load for initial setup
  return defaultProfile;
}
