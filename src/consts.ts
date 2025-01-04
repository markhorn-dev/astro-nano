import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Marek Szkudelski",
  EMAIL: "marek@szkudelski.dev",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Strona główna",
  DESCRIPTION: "Strona wizytówka połączona z blogiem programistycznym",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Blog na tematy programistyczne i rozwojowe w karierze IT",
};

export const WORK: Metadata = {
  TITLE: "Doświadczenie",
  DESCRIPTION: "Moje doświadczenie zawodowe",
};

export const PROJECTS: Metadata = {
  TITLE: "Inne materiały",
  DESCRIPTION: "Materiały z poza bloga gdzie dziele się wiedzą i doświadczeniem",
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
