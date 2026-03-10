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
  technologies: string[];
  date: string;
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
}

export interface EnglishScore {
  testName: string;
  score: string;
  date: string;
}

export interface ProfileData {
  intro: Intro;
  techStack: TechStackCategory[];
  portfolio: PortfolioItem[];
  certifications: Certification[];
  patents: Patent[];
  englishScores: EnglishScore[];
}
