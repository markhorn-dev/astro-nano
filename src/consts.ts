import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "PLANET-N 🇳🇵 ✈️ 🇺🇸 👨‍💻",
  DESCRIPTION: "Welcome to PLANET-N, a personal portfolio and blog for Nitesh Rijal.",
  AUTHOR: "Nitesh Rijal",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "rijal.it@gmail.com",
    HREF: "mailto:rijal.it@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "openrijal",
    HREF: "https://github.com/openrijal"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "openrijal",
    HREF: "https://www.linkedin.com/in/openrijal/",
  },
  { 
    NAME: "Twitter",
    ICON: "twitter-x",
    TEXT: "opynrijal",
    HREF: "https://x.com/opynrijal",
  },
]

