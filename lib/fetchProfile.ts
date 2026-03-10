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

export async function fetchProfile(): Promise<ProfileData> {
  const ociUrl = process.env.OCI_DATA_URL;

  if (ociUrl) {
    try {
      const res = await fetch(ociUrl, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });
      if (res.ok) {
        return res.json() as Promise<ProfileData>;
      } else {
        console.warn(`Failed to fetch profile from OCI (Status: ${res.status}). Returning default.`);
      }
    } catch (error) {
      console.error("Error fetching from OCI URL:", error);
    }
  } else {
    console.warn("OCI_DATA_URL is not set.");
  }

  // Fallback to empty default data so the admin page can still load for initial setup
  return defaultProfile;
}
