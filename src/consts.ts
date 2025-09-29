import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Henningscho.land",
  EMAIL: "ping@henningscho.land",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Start",
  DESCRIPTION: "Erste Seite",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const SNIPPTES: Metadata = {
  TITLE: "Snippets",
  DESCRIPTION: "Great code, automate tasks and increase efficiency. Command line ninja.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/henning-scholand-19010970/",
  }
];
