---
title: "Blog Collection"
description: "How to add posts to your blog."
date: "Mar 21 2024"
---

The `blog` collections is found in `src/content/blog`.

Working with the `blog` collection:

```
📁 /src/content/blog
└── 📁 post-1
      └── 📄 index.md
└── 📁 post-2
      └── 📄 index.mdx
```

In the above example, two static pages will be generated, based on the existence of a classic markdown `.md` file or a jsx compatible markdown `.mdx` file. The folder name represents the slug:

- `https://example.com/blog/post-1`
- `https://example.com/blog/post-2`


All content must be preceded by required metadata in the markdown file in `yaml` format, and be enclosed by triple dashes. --- ---

```mdx
---
title: "My cool new title"
description: "A description of my content."
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
| draft       | No* | boolean | draft: true, content will not be published.      |

All that's left to do is write your content under the metadata.

```mdx
---
title: "My cool new title"
description: "A description of my content."
date: "Mar 22 2024"
draft: false
---

### Woot

This is a paragraph.
```

🎉 Congrats, you are now a blogger.