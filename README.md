# Markdown Editor Core

_Markdown Editor Core_ is a WYSIWYG markdown editor based on the JavaScript text editor [_CodeMirror_](https://codemirror.net/index.html).

The editor shipped with this library can be used standalone to write Markdown in an efficient way with nice highlighting.
However, this library is **mainly intended to work as a universal core component for other Markdown Editors**, that are e.g. implemented for big JS-based frameworks or other JS systems.
Therefore, _Markdown Editor Core_ provides a simple and clear API for all common actions necessary when writing markdown and the editor is highly configurable.

The goal of this library is to provide a fully working text editor which can be controlled by its API, without establishing a specific view or adding further visual components like toolbar buttons as known from other fully-WYSIWYG editors.
This makes it easily extensible and customizable for your needs, while setting you free from thinking about text manipulation.

_Markdown Editor Core_ was developed for and in parallel with [Ngx Markdown Editor](https://github.com/lenardfunk/ngx-markdown-editor).
Thus, the latter is one example of how this library can be used. In the same way, components could be implemented for React or Vue or your custom JS app.

## Table of Contents

- [Markdown Editor Core](#markdown-editor-core)
  - [Table of Contents](#table-of-contents)
  - [How to install](#how-to-install)
  - [How to use](#how-to-use)
  - [Configuration options](#configuration-options)
  - [Shortcuts](#shortcuts)
  - [Theming](#theming)
    - [How to change the editor's styling](#how-to-change-the-editors-styling)
    - [How to change the markup styling (e.g. heading, bold, ...)](#how-to-change-the-markup-styling-eg-heading-bold-)
  - [How to contribute](#how-to-contribute)
    - [Writing issues](#writing-issues)
    - [Making pull requests](#making-pull-requests)
  - [Project setup](#project-setup)
    - [Package manager](#package-manager)
    - [Commit rules](#commit-rules)
    - [Coding style guidelines](#coding-style-guidelines)
  - [A word on tests](#a-word-on-tests)

## How to install

Run

```
npm i markdown-editor-core
```

or

```
yarn add markdown-editor-core
```

Load _CodeMirror_'s stylesheet for its default theme and other required stylings; e.g. by including it into your `index.html`:

```html
<link rel="stylesheet" href="../node_modules/codemirror/lib/codemirror.css" />
```

## How to use

To instantiate `MarkdownEditor`, you must specify a wrapper element and you can pass an optional [configuration object](#configuration-options).

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

It is possible to synchronize the editor's content with the content of the textarea in two ways:

- either manually via `mde.syncTextarea()`
- or automatically by setting the option `autoSync` to `true`.

You can also switch back to the textarea via `mde.toTextarea()` (this destroys the Markdown Editor instance).

## Configuration options

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
      <td>Specifies whether the editor has autofocus. (Applies if no other element holds focus already.)</td>
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
      <td>Specifies whether lines are wrapped (<code>true</code>) or overflow in x-direction (<code>false</code>).</td>
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
      <td>The placeholder shown in the editor when it is empty.</td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td><code>preferredTokens:</code>
        <ul>
          <li><code>bold: '**' | '__'</code></li>
          <li><code>italic: '*' | '_'</code></li>
          <li><code>horizontalRule: '---' | '***' | '___'</code></li>
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
            <li><code>horizontalRule: '---'</code></li>
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
      For <b>inline templates</b> (<code>link</code>, <code>imageLink</code>) a before-cursor and after-cursor part can be specified to define the cursor position after insertion.<br>
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
      <td>Specifies whether using shortcuts for user actions is enabled. Disabling might be useful for example, if shortcuts shall be handled by another framework or listen to an HTML element wrapping the Markdown Editor.)</td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td><code>tabSize: number</code></td>
      <td>The size of one tab character (in number of spaces).</td>
      <td><code>4</code></td>
    </tr>
    <tr>
      <td><code>theme: string</code></td>
      <td>The theme to style the editor with. You must make sure the CSS file defining the corresponding <code>.cm-s-[name]</code> styles is loaded. You can also apply multiple themes.<br><br>
      Example:      
      <ul>
        <li>"example-theme" results in <code>.cm-s-example-theme</code></li>
        <li>"foo bar" results in <code>.cm-s-foo .cm-s-bar</code></li>
      </ul></td>
      <td><code>'default'</code></td>
    </tr>
  </tbody>
</table>

## Shortcuts

The default keymap is as follows (on Mac "Ctrl" is replaced with "Cmd"):

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
| `insertHorizontalRule` | Shift-Ctrl--     |
| `toggleInlineCode`     | Ctrl-7           |
| `insertCodeBlock`      | Shift-Ctrl-7     |
| `openMarkdownGuide`    | F1               |
| `toggleRichTextMode`   | Alt-R            |
| `downloadAsFile`       | Shift-Ctrl-S     |
| `importFromFile`       | Ctrl-Alt-I       |
| `formatContent`        | Alt-F            |

You can customize the individual shortcuts inside Markdown Editor Options via `options.shortcuts`.

For shortcuts that come built-in with _CodeMirror_, see [_CodeMirror_ documentation](https://codemirror.net/doc/manual.html#commands).

If you want to specify your own shortcuts via _CodeMirror_, mind the correct order of special keys: **Shift-Cmd-Ctrl-Alt** (see [here](https://codemirror.net/doc/manual.html#keymaps)).
You can add new shortcuts using `mde.addShortcut(hotkeys, void)` or remove existing ones using `mde.removeShortcut(hotkeys)`.

## Theming

### How to change the editor's styling

The editor's view can be customized using [_CodeMirror_ themes](https://codemirror.net/doc/manual.html#option_theme).
The default theme of _CodeMirror_ is "default" (results in the class `.cm-s-default`), which basically presents a blank editor and defines the default styles for the markup highlighting.

To apply a customized theme with the name "example"

- specify `{ theme: 'example' }` in the Markdown Editor Options,
- define the CSS class `.cm-s-example` in a CSS file, and
- make sure to load the CSS file with your app.

With such a theme you can customize _CodeMirror_'s visual appearance and behavior.
For further details visit the [dedicated section](https://codemirror.net/doc/manual.html#styling) on _CodeMirror_.

If you only want to extend the default theme, you can either define new stylings for the class `.cm-s-default` and make sure that the "default" theme is applied or you can create you own additional theme and specify two themes in the Markdown Editor Options: `{ theme: 'default additional-theme' }`.

### How to change the markup styling (e.g. heading, bold, ...)

The markup stylings work with _CodeMirror_ classes as well and can (and should!) therefore be part of a _CodeMirror_ theme.
If you want to change the styling of "bold" markup for example, then define a new style for `.cm-bold`. Again, this should
preferably be done within a theme (also see ["How to use your own theme"](#how-to-change-the-editors-styling)).

The classes for markup styling are:

| Markup type                     | Class                             |
| ------------------------------- | --------------------------------- |
| Heading                         | `.cm-header`                      |
| Bold                            | `.cm-bold`                        |
| Italic                          | `.cm-italic`                      |
| Strikethrough                   | `.cm-strikethrough`               |
| List level 1                    | `.cm-list-level-1`, `.cm-list`    |
| List level 2                    | `.cm-list-level-2`, `.cm-list`    |
| List level > 2                  | `.cm-list-level-gt-2`, `.cm-list` |
| Quote                           | `.cm-quote`                       |
| Link (hyperlink in general)     | `.cm-link`                        |
| Link text (part inside "[...]") | `.cm-link-text`                   |
| Link href (part inside "(...)") | `.cm-link-href`, `.cm-link`       |
| Email link                      | `.cm-link-email`, `.cm-link`      |
| Inline link ("<http\://...>")   | `.cm-link-inline`, `.cm-link`     |
| Image                           | `.cm-image`                       |
| Image alt text                  | `.cm-image-alt-text`              |
| Image marker ("!")              | `.cm-image-marker`                |
| Horizontal rule                 | `.cm-hr`                          |
| Code                            | `.cm-code`                        |
| Emoji                           | `.cm-emoji`                       |
| Tokens                          | `.cm-token`                       |

The last table row entry "tokens" refers to all markup tokens like \*\*, \_, [], (), etc. and only
applies if `highlightTokens` is enabled in the Markdown Editor Options. If this is true, then
all tokens have the class `.cm-token`. Additionally every token is given an individual class
corresponding to the markup type to which it belongs to and eventually a "token level class". This means, you can easily style all tokens in the same way or each token type individually.

Examples:

- The \*\* tokens for bold text have the classes `cm-strong cm-token cm-token-strong`
- A > token for quotation in the second level (second token of >>) has the classes `cm-quote cm-quote-2 cm-token cm-token-quote cm-token-quote-2`.

Here is a list of all _CodeMirror_ token classes:

| Token type                     | Class                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------- |
| Heading `#`                    | `.cm-token-header`, `.cm-token-header-[n]`                                        |
| Bold `**`                      | `.cm-token-strong`                                                                |
| Italic `_`                     | `.cm-token-em`                                                                    |
| Strikethrough `~~`             | `.cm-token-strikethrough`                                                         |
| Unordered list `-`             | `.cm-token-list`, `.cm-token-list-ul`                                             |
| Ordered list `1.`              | `.cm-token-list`, `.cm-token-list-ol`                                             |
| Checklist `- [x]`              | `.cm-token-list`, `.cm-token-list-ul` ("-" token); `.cm-token-task` ("[x]" token) |
| Quote `>`                      | `.cm-token-quote`, `.cm-token-quote-[n]`                                          |
| Link `[]()`                    | `.cm-token-link` ("[]" token); `.cm-token-link-string` ("()" token)               |
| Image `![]()`                  | `.cm-token-image` ("![]" token); `.cm-token-link-string` ("()" token)             |
| Inline Code <code>\`</code>    | `.cm-token-code`                                                                  |
| Code block <code>\`\`\`</code> | `.cm-token-code-block`                                                            |

## How to contribute

First of all, contributions in any way are very welcome! And a big thank you to all who decide to so!! :)

The code is neither perfect nor complete. If you have any suggestions, requirements or even just comments, please let me know and I will do my best do incorporate them! The even better (and probably faster) way for requesting code modifications, however, are pull requests. I am very happy about all code contributions as time is often rare around here... :)

### Writing issues

When writing issues, please give a clear description of the current state and what you are unhappy
about. Then, if possible, propose your solution or at least leave a short statement of your thoughts
about it.

### Making pull requests

Recipe for making a pull request:

1. Fork and checkout repo locally.
2. Install [_Yarn_](https://yarnpkg.com/), if you do not have it yet. For example via `npm i yarn -g`.
3. Open a command line, move to the project directory and run `yarn` to install all dependencies.
4. Make your code changes. (Please mind the [style guidelines](#coding-style-guidelines).)
5. Use `yarn run start` to test your changes in the demo app.
6. Check the docs whether they need to be changed.
7. Push the changes to your fork.
8. Make a pull request to the _master_ branch of this repo. Please provide a meaningful title for
   the PR and give a concise description.

## Project setup

### Package manager

This project uses [_Yarn_](https://yarnpkg.com/) as package manager. So you must use this one to install dependencies when contributing code. The scripts in _package.json_ still work with `npm`, although it is recommended to always use `yarn` throughout the project.

FYI: The main reason to
move from _npm_ to _Yarn_ was, that _Yarn_ is able to execute shell scripts platform-independent in the native console.
I.e. it also understands paths with forward slashes like `./path/to/script.sh` on windows and can execute it inside CMD.
My claim is to provide a platform-independent project setup and the described issue comes into effect, for example, when running the `build` script in _package.json_.

### Commit rules

We use [_Commitlint_](https://commitlint.js.org/#/) to guarantee structured commit messages.
This means you must write commit messages that meet the rules of _Commitlint_.
If you are not familiar with _Commitlint_, you can use the CLI tool [_Commitizen_](https://github.com/commitizen/cz-cli) by running `yarn run commit`, which assists you to
write conventional messages.
You can also install _Commitizen_ globally on your system, if you want to use the shorter cli commands `cz` or `git cz`.

### Coding style guidelines

There are not many strict guidelines to keep in mind, but please adapt to the project's code style when contributing. Only two more things shall be mentioned here:

1. We use [_Prettier_](https://prettier.io/) to ensure consistent formatting! Therefore, you should install a _Prettier_ plugin for your IDE. Further it is highly recommended to enable "Format on save", which is also set as the project's default for VSCode.

   There is a pre-commit git hook for _Prettier_, which checks the formatting of all files. Occasionally
   it might happen that this hook fails although you have "Format on save" enabled. This is usually
   due to wrong line endings, e.g. caused by `yarn add ...` or some other file-writing script or tool.
   In this case, run `yarn run format:write` to let _Prettier_ correct the wrong formatting and then try to commit again. Unfortunately,
   the `format:write` command cannot be set as a pre-commit hook as it is not known in general, which
   files need to be staged afterwards.

2. The methods in [`markdown-editor.ts`](./lib/src/markdown-editor.ts) are grouped into 5 sections as you can see when inspecting the file. Please put new methods at the end of the corresponding section:
   - **Basic Editor API**: basic actions like `toggleBold`
   - **Extended Editor API**: extended actions like `downloadAsFile`, usually do not change the content
   - **Developer API**: methods useful for developers using this library
   - **Markdown Editor Options**: methods for getting or setting `MarkdownEditorOptions`
   - **Private methods**: all private methods (all methods in previous sections should be `public` or `protected`)

## A word on tests

As you might have noticed, this project does not contain any tests. Well yes, I have noticed that, too... and I really hope to be able to add tests in the future some time. However, it has not been very easy to decide what to test and what not so far. Because it is a highly interactive application, it contains a lot of edge cases, far more than standard cases (of which most are directly visible to human's eye anyway). Especially the multiple-cursor mode of _CodeMirror_ increases the number of test branches tremendously. In addition, it is quite hard to draw a line between testing the Markdown Editor (which is the goal) and testing _CodeMirror_, which is already tested quite well.

Those issues are clearly not an excuse to omit tests totally, but they drove me to the decision to postpone writing tests a bit as I wanted to finally come to the point, where this project is ready for release. However, this is why it was even more important for me to provide a detailed documentation both in code files and in this Readme.

Finally, due to the high number of edge cases, I would like to encourage you again to contribute - either by writing issues or by explicitly fixing things in code - whenever you discover bugs or odd behavior! I believe, helping each other out by quickly pointing those problems is a very good and also effective way, too, in order to improve an applications quality.
