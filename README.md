# Markdown Editor Core

Markdown Editor Core is a WYSIWYG markdown editor based on the JavaScript text editor [Codemirror](https://codemirror.net/index.html).

The editor shipped with this library can be used standalone to write Markdown in an efficient way with nice highlighting. However, this library is **mainly intended to work as a universal core component for other Markdown Editors**, that are e.g. implemented for big JS-based frameworks or other JS systems. Therefore, Markdown Editor Core provides a simple and clear API for all common actions necessary when writing markdown and the editor is highly configurable.

The goal of this library is to provide a fully working text editor which can be controlled by its API, without establishing a specific view or adding further visual components like toolbar buttons as known from other fully-WYSIWYG editors. This makes it easily extensible and customizable for your needs, while setting you free from thinking about text manipulation.

Markdown Editor Core was developed for and in parallel with [Ngx Markdown Editor](https://github.com/lenardfunk/ngx-markdown-editor). Thus, the latter is one example of how this library can be used. In the same way components could be implemented for React or Vue or your custom JS app.

### How to install

Run

```
npm i markdown-editor-core
```

or

```
yarn add markdown-editor-core
```

Load Codemirror's stylesheet for default theme and other required stylings,
e.g. by including it into your `index.html`:

```html
<link rel="stylesheet" href="../node_modules/codemirror/lib/codemirror.css" />
```

### How to use

To instantiate Markdown Editor, you must specify a wrapper element and can pass an
optional [configuration object](#configuration-options).

```typescript
const wrapper = document.getElementById('my-wrapper-element') as HTMLElement; // required
const options: MarkdownEditorOptions = { ... };                               // optional

const mde = new MarkdownEditor(wrapper, options);
```

You can also replace an existing textarea with the Markdown Editor.

```typescript
const textarea = document.getElementById('my-textarea') as HTMLTextareaElement; // required
const options: MdeFromTextareaOptions = { ... };                                // optional

const mde = new MarkdownEditorFromTextarea(textarea, options);
```

It is possible to synchronize the editor's content with the content of the
textarea in two ways: either manually via `mde.syncTextarea()` or automatically
using the option `autoSync`. You can also switch back to the textarea
via `mde.toTextarea()` (this destroys the Markdown Editor instance).

### Configuration options

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
      <th>Default value</th>
    </tr>
    <tr></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>autofocus: boolean</code></td>
      <td>Specifies whether the editor has autofocus (applies if no other element has focus already).</td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>disabled: boolean</code></td>
      <td>Specifies whether the editor is disabled.</td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td><code>downloadFileNameGenerator: () => string</code></td>
      <td>A function to generate the name for the markdown file created by <code>downloadAsFile()</code>.</td>
      <td>Function which returns the current time string plus <code>.md</code> extension: <code>'YYYYMMDD_hhmmss.md'</code></td>
    </tr>
    <tr>
      <td><code>lineNumbers: boolean</code></td>
      <td>Specifies whether line numbers are shown.</td>
      <td><code>false</code></td>
    </tr>
    <tr>
      <td><code>lineWrapping: boolean</code></td>
      <td>Specifies whether lines are wrapped (<code>true</code>) or overflow in x direction (<code>false</code>).</td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>markdownGuideUrl: string</code></td>
      <td>The url to which <code>openMarkdownGuide()</code> links to.</td>
      <td><code>'https://www.markdownguide.org/basic-syntax/'</code></td>
    </tr>
    <tr>
      <td><code>multipleCursors: boolean</code></td>
      <td>Specifies whether multiple cursors are allowed. If <code>true</code>, additional cursors can be added via <i>Ctrl-Leftclick</i> / <i>Cmd-Leftclick</i></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>placeholder: string</code></td>
      <td>The placeholder shown in the empty editor field.</td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td><code>preferredTokens:</code>
        <ul>
          <li><code>bold: '**' | '__'</code></li>
          <li><code>italic: '*' | '_'</code></li>
          <li><code>horizontalLine: '---' | '***' | '___'</code></li>
          <li><code>codeBlock: '```' | '~~~'</code></li>
          <li><code>unorderedList: '-' | '*'</code></li>
          <li><code>checkList: '-' | '*'</code></li>
        </ul>
      </td>
      <td>Specifies the preferred tokens for every format markup that allows different markup styles. Note: for <code>checklist</code> the full token will be <code>- [x]</code> or <code>* [x]</code>.</td>
      <td>
        <ul>
            <li><code>bold: '**'</code></li>
            <li><code>italic: '_'</code></li>
            <li><code>horizontalLine: '---'</code></li>
            <li><code>codeBlock: '```'</code></li>
            <li><code>unorderedList: '-'</code></li>
            <li><code>checkList: '-'</code></li>
          </ul>
      </td>
    </tr>
    <tr>
      <td><code>preferredTemplates:</code>
        <ul>
          <li><code>link: [string, string]</code></li>
          <li><code>imageLink: [string, string]</code></li>
          <li><code>table: string | { rows: number columns: number }</code></li>
        </ul>
      </td>
      <td>Specifies the preferred templates that are inserted on the corresponding actions.<br>
      For <b>inline templates</b> (<code>link</code>, <code>imageLink</code>) a before-cursor and after-cursor part can be specifies to define the cursor position after insertion.<br>
      For <b>block templates</b> (<code>table</code>) the template can be defined as a string and is generally inserted before the cursor.<br><br>
      For the <code>table</code> template there is additionally the possibility to define just the number of rows and columns, which results in the default table template with the specified dimensions.</td>
      <td>
        <ul>
          <li><code>link: ['[', '](https://)']</code></li>
          <li><code>imageLink: ['![', '](https://)']</code></li>
          <li><code>table: { rows: 2, columns: 2 }</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>richTextMode: boolean</code></td>
      <td>If <code>true</code>, the editor shows formatting ("almost WYSIWYG"). If <code>false</code>, the editor's content remains as plain text.</td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>shortcuts: MarkdownEditorShortcuts</code></td>
      <td>The keymap for all possible user actions in the Markdown Editor.</td>
      <td>See <a href="#shortcuts">Shortcuts</a>.</td>
    </tr>
    <tr>
      <td><code>shortcutsEnabled: boolean</code></td>
      <td>Specifies whether using shortcuts for user actions is enabled. (E.g. useful if shortcuts shall be handled by other framework or listen to a HTML element wrapping the Markdown Editor.)</td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>tabSize: number</code></td>
      <td>The size of one tab character (in number of spaces).</td>
      <td><code>2</code></td>
    </tr>
    <tr>
      <td><code>theme: string</code></td>
      <td>The theme to style the editor with. You must make sure the CSS file defining the corresponding .cm-s-[name] styles is loaded. You can also apply multiple themes.<br><br>
      Example:      
      <ul>
        <li>"example-theme" results in ".cm-s-example-theme"</li>
        <li>"foo bar" results in ".cm-s-foo .cm-s-bar"</li>
      </ul></td>
      <td><code>'default'</code></td>
    </tr>
  </tbody>
</table>

### Shortcuts

| Action                 | Shortcut         |
| ---------------------- | ---------------- |
| `increaseHeadingLevel` | Alt-H            |
| `decreaseHeadingLevel` | Shift-Alt-H      |
| `toggleBold`           | Ctrl-B           |
| `toggleItalic`         | Ctrl-I           |
| `toggleStrikethrough`  | Ctrl-K           |
| `toggleUnorderedList`  | Ctrl-L           |
| `toggleOrderedList`    | Shift-Ctrl-L     |
| `toggleCheckList`      | Shift-Ctrl-Alt-L |
| `toggleQuote`          | Ctrl-Q           |
| `insertLink`           | Ctrl-M           |
| `insertImageLink`      | Shift-Ctrl-M     |
| `insertTable`          | Ctrl-Alt-T       |
| `insertHorizontalLine` | Shift-Ctrl--     |
| `toggleInlineCode`     | Ctrl-7           |
| `insertCodeBlock`      | Shift-Ctrl-7     |
| `openMarkdownGuide`    | F1               |
| `toggleRichTextMode`   | Alt-R            |
| `downloadAsFile`       | Shift-Ctrl-S     |
| `importFromFile`       | Ctrl-Alt-I       |
| `formatContent`        | Alt-F            |

On Mac "Ctrl" is replaced with "Cmd".

For shortcuts that come built-in with Codemirror, see [Codemirror documentation](https://codemirror.net/doc/manual.html#keymaps).

If you want to specify your own shortcuts via Codemirror, mind the correct order of special keys: **Shift-Cmd-Ctrl-Alt**

### FAQs

#### How to change the editor's styling

The editor's view can be customized using [Codemirror themes](https://codemirror.net/doc/manual.html#option_theme). The default theme of Codemirror is "default" (results in the class `.cm-s-default`),
which basically presents a blank editor and defines the default styles for the markup highlighting.

To apply a customized theme with the name "example"

- specify `theme: 'example'` in the Markdown Editor Options,
- define the CSS class `.cm-s-example` in a CSS file, and
- make sure to load the CSS file with your app.

With such a theme you can customize Codemirror's visual appearance and behavior.
For further details visit the [dedicated section](https://codemirror.net/doc/manual.html#styling)
on Codemirror.

If you only want to extend the default theme, you can either define new stylings for the class
`.cm-s-default` and make sure that the "default" theme is applied or you can create you own additional
theme and specify two themes in the Markdown Editor Options: `theme: 'default additional-theme'`.

#### How to change the markup styling (e.g. heading, bold, ...)

The markup stylings work with Codemirror classes as well and can (and should!) therefore be part of a Codemirror theme.
If want to change for example the styling of the "bold" markup, then define a new style for `.cm-bold`. Again, this should
preferably be done within a theme (also see ["How to use your own theme"](#how-to-change-the-editor's-styling)).

The classes for markup styling are:

| Markup type                     | Class                         |
| ------------------------------- | ----------------------------- |
| Heading                         | `.cm-header`                  |
| Bold                            | `.cm-bold`                    |
| Italic                          | `.cm-italic`                  |
| Strikethrough                   | `.cm-strikethrough`           |
| List level 1                    | `.cm-list-level-1`            |
| List level 2                    | `.cm-list-level-2`            |
| List level > 2                  | `.cm-list-level-gt-2`         |
| Quote                           | `.cm-quote`                   |
| Link (hyperlink in general)     | `.cm-link`                    |
| Link text (part inside "[...]") | `.cm-link-text`               |
| Link href (part inside "(...)") | `.cm-link-href`, `.cm-link`   |
| Email link                      | `.cm-link-email`, `.cm-link`  |
| Inline link ("<http://...>")    | `.cm-link-inline`, `.cm-link` |
| Image                           | `.cm-image`                   |
| Image alt text                  | `.cm-image-alt-text`          |
| Image marker ("!")              | `.cm-image-marker`            |
| Horizontal rule                 | `.cm-hr`                      |
| Code                            | `.cm-code`                    |
| Emoji                           | `.cm-emoji`                   |
| Tokens                          | `.cm-token`                   |

The last table row entry "tokens" refers to all markup tokens like \*\*, \_, [], (), etc. and only
applies if `highlightTokens` is enabled in the Markdown Editor Options. If this is true, then
all tokens have the class `.cm-token`. Additionally every token is given an individual class
corresponding to the Markup type to which it belongs to and eventually a "token level class". This means, you can easily style all tokens in the same way or each token type individually.

Examples:

- The \*\* tokens for bold text have the classes `cm-strong cm-token cm-token-strong`
- A > token for quotation in the second level (second token of >>) has the classes `cm-quote cm-quote-2 cm-token cm-token-quote cm-token-quote-2`.

Here is a list of all Codemirror token classes:

| Token type     | Class                                                                             |
| -------------- | --------------------------------------------------------------------------------- |
| Heading        | `.cm-token-header`, `.cm-token-header-[n]`                                        |
| Bold           | `.cm-token-strong`                                                                |
| Italic         | `.cm-token-em`                                                                    |
| Strikethrough  | `.cm-token-strikethrough`                                                         |
| Unordered list | `.cm-token-list`, `.cm-token-list-ul`                                             |
| Ordered list   | `.cm-token-list`, `.cm-token-list-ol`                                             |
| Checklist      | `.cm-token-list`, `.cm-token-list-ul` ("-" token); `.cm-token-task` ("[x]" token) |
| Quote          | `.cm-token-quote`, `.cm-token-quote-[n]`                                          |
| Link           | `.cm-token-link` ("[...]" token); `.cm-token-link-string` ("()" token)            |
| Image          | `.cm-token-image` ("![...]" token); `.cm-token-link-string` ("()" token)          |
| Inline Code    | `.cm-token-code`                                                                  |
| Code block     | `.cm-token-code-block`                                                            |

### How to contribute

#### Writing issues

#### Making pull requests

#### Project setup

- Yarn
- Commitlint
- Prettier

### Note on tests
