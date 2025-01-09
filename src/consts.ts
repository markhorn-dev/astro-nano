import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Marek Szkudelski",
  EMAIL: "marek@szkudelski.dev",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Programuję i Dzielę się Wiedzą – Portfolio i Blog",
  DESCRIPTION: "Portfolio programisty z doświadczeniem w frontendzie. CV, projekty oraz blog o technologiach i pracy w IT – techniczne artykuły i porady dla programistów.",
};

export const BLOG: Metadata = {
  TITLE: "Blog – Techniczne i Miękkie Artykuły o IT",
  DESCRIPTION: "Blog poświęcony technologiom, programowaniu i pracy w branży IT. Zawiera artykuły techniczne oraz treści dotyczące rozwoju i umiejętności miękkich w IT.",
};

export const WORK: Metadata = {
  TITLE: "Moje doświadczenie i CV",
  DESCRIPTION: "Moje doświadczenie zawodowe w IT. Poznaj projekty, nad którymi pracowałem, moje umiejętności techniczne oraz pełne CV.",
};

export const PROJECTS: Metadata = {
  TITLE: "Inne Materiały – Podcasty i Artykuły",
  DESCRIPTION: "Moje wystąpienia w podcastach, artykuły gościnne i inne materiały, w których dzielę się wiedzą i doświadczeniem z zakresu IT.",
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
