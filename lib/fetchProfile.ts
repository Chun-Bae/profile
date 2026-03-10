import { ProfileData } from "../types/profile";
import localProfileData from "../public/profile.json";

export async function fetchProfile(): Promise<ProfileData> {
  const ociUrl = process.env.OCI_DATA_URL;

  if (ociUrl) {
    try {
      const res = await fetch(ociUrl, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });
      if (!res.ok) {
        console.warn(`Failed to fetch profile from OCI (Status: ${res.status}).`);
      } else {
        return res.json() as Promise<ProfileData>;
      }
    } catch (error) {
      console.error("Error fetching from OCI URL, falling back to local data:", error);
    }
  }

  // Fallback to local dummy data
  return localProfileData as ProfileData;
}
