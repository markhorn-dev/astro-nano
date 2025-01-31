import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Ahmad Muhammad",
  EMAIL: "ahmadmuhammadgd@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Ahmad Muhammad's Data Engineering Portfolio.",
};

export const BLOG: Metadata = {
  TITLE: "Blogs",
  DESCRIPTION: "Collection of articles on topics I am passionate about.",
};

// export const WORK: Metadata = {
//   TITLE: "Work",
//   DESCRIPTION: "Where I have worked and what I have done.",
// };

export const ABOUT: Metadata = {
  TITLE: "About",
  DESCRIPTION: "Get to know me better.",
};

export const PROJECTS: Metadata = {
  TITLE: "Live Projects",
  DESCRIPTION: "A collection of my projects, with links to repositories.",
};


export const WORK_SAMPLES: Metadata = {
  TITLE: "Work Samples",
  DESCRIPTION: "A collection of my work samples, with links to repositories.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "GitHub",
    HREF: "https://github.com/ahmadmuhammadgd"
  },
  { 
    NAME: "LinkedIn",
    HREF: "https://www.linkedin.com/in/ahmadmuhammadgd",
  }
];
