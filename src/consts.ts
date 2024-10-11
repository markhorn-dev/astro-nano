import type { Site, Metadata, Links } from "@types";

export const SITE: Site = {
  NAME: "Code Myriad",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Astro Nano is a minimal and lightweight blog and portfolio.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics we are passionate about.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of things we have worked on recently, with links to repositories and demos.",
};

export const LINKS: Links = [
  {
    NAME: "discourse",
    HREF: "https://forum.codemyriad.io",
  },
  {
    NAME: "github",
    HREF: "https://github.com/codemyriad",
  },
];
