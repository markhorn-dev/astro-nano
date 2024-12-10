import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Marek Szkudelski",
  EMAIL: "marek@szkudelski.dev",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "TODO",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "TODO",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "TODO",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "TODO",
};

export const SOCIALS: Socials = [
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/mszkudelski",
  },
  {
    NAME: "bluesky",
    HREF: "https://bsky.app/profile/szkudelski.dev",
  },
  {
    NAME: "github",
    HREF: "https://github.com/mszkudelski"
  },
];
