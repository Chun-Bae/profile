export interface Intro {
  name: string;
  role: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  socials: {
    github?: string;
    linkedin?: string;
    blog?: string;
  };
  motto?: string;
}

export interface TechStackCategory {
  category: string;
  skills: string[];
}

export interface PortfolioItem {
  title: string;
  description: string;
  link?: string;
  github?: string;
  sourceLinks?: { name: string; url: string }[];
  technologies: string[];
  date: string;
  mdFile?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Patent {
  title: string;
  number: string;
  date: string;
  link?: string;
  category?: string;
  status?: string;
}

export interface EnglishScore {
  testName: string;
  score: string;
  date: string;
}

export interface Award {
  title: string;
  date: string;
  organization?: string;
  description?: string;
  prize?: string;
}

export interface Education {
  schoolName: string;
  status: string;
  date: string;
  major?: string;
  gpa?: string;
  notes?: string;
  logoUrl?: string;
}

export interface Experience {
  organization: string;
  role: string;
  date: string;
  description?: string;
  link?: string;
}

// Club has the same structure as Experience
export type Club = Experience;

export interface ProfileData {
  intro: Intro;
  techStack: TechStackCategory[];
  portfolio: PortfolioItem[];
  certifications: Certification[];
  patents: Patent[];
  englishScores: EnglishScore[];
  awards?: Award[];
  educations?: Education[];
  experiences?: Experience[];
  clubs?: Club[];
}
