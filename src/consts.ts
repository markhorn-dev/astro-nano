import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Rick Hoppe",
  EMAIL: "rickjhoppe@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "My minimal portfolio website using Astro.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "My own personal digital megaphone.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/markhorn-dev"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/markhorn-dev",
  }
];
