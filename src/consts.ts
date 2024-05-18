import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Nitesh Rijal",
  EMAIL: "rijal.it@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 2,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Nitesh Rijal's Homepage",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Nitesh Rijal's Blog Posts",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Nitesh Rijal's Past Work Experiences",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "Nitesh Rijal's Projects",
};

export const SOCIALS: Socials = [
  
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/openrijal",
  },
  { 
    NAME: "twitter-x",
    HREF: "https://twitter.com/opynrijal",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/openrijal"
  },
  { 
    NAME: "instagram",
    HREF: "https://www.instagram.com/openrijal",
  }
];

export const CONTACT: Metadata = {
  TITLE: "Contact",
  DESCRIPTION: "Nitesh Rijal's Contact",
};
