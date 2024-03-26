---
title: "Markdown syntax guide"
description: "Get started writing content in markdown."
date: "Mar 17 2024"
---

---

### Headings

To create headings, use hash symbols (#) followed by a space. The number of hash symbols indicates the heading level.

```md
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>

---

### Paragraphs

Simply type non-indented text, surrounded by empty lines.

```md
<!-- empty line -->
I really like using Markdown.
<!-- empty line -->
I think I'll use it to format all of my content from now on.
<!-- empty line -->
```

I really like using Markdown.

I think I'll use it to format all of my content from now on.

---

### Bold

Use double `*` or `_` to denote bold text.

```md
it was the **best** of times, 
it was the __worst__ of times
```
It was the **best** of times,<br/>
it was the __worst__ of times

---

### Italic

Use single `*` to denote italic text.

```md
it was the age of *wisdom*, 
it was the age of *foolishness*
```
it was the age of *wisdom*,<br/>
it was the age of *foolishness*

---

### Bold and Italic

Use `*`, `**` and `_` to combine effects.

```md
it was the season of ***light***, 
it was the season of *__darkness__*
```
it was the season of ***light***,<br/> 
it was the season of *__darkness__*

---

### Line breaks

Use triple `---` to denote a line break.

```md
<!-- empty line -->
---
<!-- empty line -->
```

---

### Links

Links can be added using the `[title](url)` pattern.

```md
Nano was made with [Astro](https://astro.build)
```

Nano was made with [Astro](https://astro.build)

---

### Quick link

Add an quick link using the `<url>` pattern.

```md
<http://www.example.com>
```

<http://www.example.com>

---

### Email link

Add an email link using the `<emailaddress>` pattern.

```md
Email me at <markhorn.dev@gmail.com> using your mail app.
```

Email me at <markhorn.dev@gmail.com> using your mail app.

---

### Ordered Lists

Add a number followed by a period for items. For sub items, indent.

```md
1. Item 1
2. Item 2
    1. Sub item 1
    2. Sub item 2
3. Item 3
```

1. Item 1
2. Item 2
    1. Sub item 1
    2. Sub item 2
3. Item 3

---

### Unordered List

Add a `-` or `+` for items. Don't mix. For sub items, indent.

```md
- Item 1
- Item 2
    - Sub item 1
    - Sub item 2
- Item 3
```

- Item 1
- Item 2
    - Sub item 1
    - Sub item 2
- Item 3

---

### Relative Image

Use the `![title](./image.*)` pattern relative to the same folder as the markdown file. Notice the period.

```md
![Square Pants](./spongebob.webp)
```

![Square Pants](./spongebob.webp)

---

### Public Image

Use the `![title](/image.*)` pattern relative to the public folder. No period.

```md
![Patrick Starfish](/patrick.webp)
```

![Patrick Starfish](/patrick.webp)

---

### External Image

Use the `![title](url)` pattern.

```md
![Mr. Krabs](https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/440px-Mr._Krabs.svg.png)
```

![Mr. Krabs](https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/Mr._Krabs.svg/440px-Mr._Krabs.svg.png)

---

### Blockquotes

To add a blockquote add a `>` before a paragraph. For multi-line blockquotes,
add additional `>` for each line and include an empty spacer line.

```md
> it was the spring of hope, it was the winter of despair.
>
> Charles Dickens
```

> it was the spring of hope, it was the winter of despair.
>
> ~ Charles Dickens

---

### Strikethrough

Use the tilde `~` symbol to strikethrough text.

```md
~The earth is round.~ The earth is flat.
```

~The earth is round.~ The earth is flat.

---

### Subscript

Use the `<sub>` tag to denote subscript.

```md
H<sub>2</sub>O
```

H<sub>2</sub>O

---

### Superscript

Use the `<sup>` tag to denote superscript.

```md
E=mc<sup>2</sup>
```

E=mc<sup>2</sup>

---

### Keyboard

Use the `<kbd>` tag to denote keys on the keyboard.

```md
<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd>
```

<kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd>

---

### Abbreviate

Use the `<abbr>` tag to denote abbreviation.

```md
<abbr title="Graphics Interchange Format">GIF</abbr>
```

<abbr title="Graphics Interchange Format">GIF</abbr>

---

### Highlight

Use the `<mark>` tag to denote highlighted text.

```md
<mark>Very important text</mark>
```

<mark>Very important text</mark>

---

### Task Lists

Combine a list with 2 square brackets. `spc` incomplete `x` complete.

```md
- [x] Take out trash
- [ ] Mow the lawn
- [ ] Buy more bitcoin
```

- [x] Take out trash
- [ ] Mow the lawn
- [ ] Buy more bitcoin

---

### Tables

Use `-` for header, `|` for columns, `:` for alignment.

```md
| Item    | Ct  |
| :------ | --: |
| Bread   | 1   |
| Milk    | 1   |
| Haribo  | 10  |
```

| Item    | Buy |
| :------ | --: |
| Bread   | 1   |
| Milk    | 1   |
| Haribo  | 10  |

---

### Footnotes

Add a caret and an id inside brackets `[^1]` to create a footnote.

```md
Here's a simple footnote, [^1] and here's a another one. [^2]
[^1]: This is the first footnote.
[^2]: This is the second footnote.
```

Here's a simple footnote, [^1] and here's a another one. [^2]
[^1]: This is the first footnote.
[^2]: This is the second footnote.

See the bottom of the page to view the footnotes.

---

### Code

Use backticks ` to denote a word or phrase as code.

```md
`package.json`
```

`package.json`

---

### Code Blocks

Denote a code block by enclosing a section of valid code in triple backticks. Syntax highlight the code by using the shorthand symbol for the language. Ex: js, javascript, python

````
```js
  function hello() {
    console.log("hello world");
  }
```
````

```js
  function hello() {
    console.log("hello world");
  }
```

---

### Conclusion

Please refer to markdownguide.org for best practices as well as advanced and extended syntax.

https://www.markdownguide.org/basic-syntax
https://www.markdownguide.org/extended-syntax/

---



