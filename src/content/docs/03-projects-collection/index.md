---
title: "Projects Collection"
description: "How to add projects to your portfolio."
date: "Mar 20 2024"
---

The `projects` collections is found in `src/content/projects`.

Working with the `projects` collection:

```
📁 /src/content/projects
└── 📁 project-1
      └── 📄 index.md
└── 📁 projects-2
      └── 📄 index.mdx
```

In the above example, two static pages will be generated, based on the existence of a classic markdown `.md` file or a jsx compatible markdown `.mdx` file. The folder name represents the slug:

- `https://example.com/projects/project-1`
- `https://example.com/projects/project-2`


All content must be preceded by required metadata in the markdown file in `yaml` format, and be enclosed by triple dashes. --- ---

```mdx
---
title: "My awesome project"
description: "A description of my project."
date: "Mar 22 2024"
draft: false
---
```

Metadata fields

| Field       | Req | Type    | Remarks                                          |
| :---------- | :-- | :------ | :----------------------------------------------- |
| title       | Yes | string  | Title of the content. Used in SEO and RSS.       |
| description | Yes | string  | Description of the content. Used in SEO and RSS. |
| date        | Yes | string  | Must be a valid date string (able to be parsed). |
| draft       | No  | boolean | draft: true, content will not be published.      |
| demoURL     | No  | string  | Link to live project demo, if applicable.        |
| repoURL     | No  | string  | Link to project repo, if applicable.             |

All that's left to do is write your content under the metadata.

```mdx
---
title: "My awesome project"
description: "A description of my project."
date: "Mar 22 2024"
draft: false
---

### Woot

This is a paragraph about my project.
```

🎉 Congrats, you are now a blogger, _and_ developer.