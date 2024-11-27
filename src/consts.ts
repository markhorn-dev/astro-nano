import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Ludwig Bossle",
  EMAIL: "info@ludwigbossle.de",
  NUM_POSTS_ON_HOMEPAGE: 2,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "A personal website to share my ideas.",
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
  DESCRIPTION: "A collection of my projects.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/lbossle"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/ludwig-bossle/",
  }
];
