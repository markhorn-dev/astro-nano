import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Steve Luu",
  EMAIL: "steve@withpursuits.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "The home and portfolio of Steve Luu.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://x.com/sluu",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/steveluu"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/steveluu/",
  }
];
