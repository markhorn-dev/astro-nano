---
title: "Work Collection"
description: "How to add work experience."
date: "Mar 19 2024"
---

The `work` collections is found in `src/content/work`.

Working with the `work` collection:

```
📁 /src/content/work
└── 📄 apple.md
└── 📄 facebook.md
└── 📄 google.md
└── 📄 mcdonalds.md
```

In the above example, four entries on the /work page will be generated.

`apple`, `facebook`, `google`, `mcdonalds`

All content must be preceded by required metadata in the markdown file in `yaml` format, and be enclosed by triple dashes. --- ---

```mdx
---
company: "McDonalds"
role: "French Fryer"
dateStart: "01/01/2020"
dateEnd: "11/27/2022"
---
```

Metadata fields

| Field       | Req | Type    | Remarks                                          |
| :---------- | :-- | :------ | :----------------------------------------------- |
| company     | Yes | string  | Company name.                                    |
| role        | Yes | string  | Role at the company. Ex: Full stack developer.   |
| dateStart   | Yes | string  | Date string that can be parsed to a date.        |
| dateEnd     | Yes | string  | Date string that can be parsed to a date.        |

\* _Note: If you are still employed at company, for dateEnd you can enter Current, 
Now or Present instead of a date._

All that's left to do is write your content under the metadata.

```mdx
---
title: "My awesome project"
description: "A description of my project."
date: "Mar 22 2024"
draft: false
---

### Woot

This is a paragraph about my role at this company.
```

🎉 Congrats, you are now a blogger, _and_ developer, _and_ employed.