import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Jacob Experiments",
  EMAIL: "jfelding+projects@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Jacob Experiments is a place to collect my project ideas and their results.",
};

export const BLOG: Metadata = {
  TITLE: "Project Outputs",
  DESCRIPTION: "Results of my projects are posted as blog posts.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects & Ideas",
  DESCRIPTION: "A collection of my projects.",
};

export const SOCIALS: Socials = [
  {
    NAME: "github",
    HREF: "https://github.com/jfelding"
  },
  {
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/jacob-ungar-felding/",
  }
];
