# Requirements

## Core

- TypeScript Rich-text Markdown Editor
- Default Renderer?
- Default short cuts
- Auto-save in local storage
- Code highlighting (e.g. highlight.js)
- API for basic editor functionality:
  - Toggle Bold (for **selection**)
  - Toggle Italic (for **selection**)
  - Toggle Strikethrough (for **selection**)
  - Dropdown for Heading level (whole line)
  - Toggle List (order **or** unordered)
  - Toggle Quote (always **before list symbol**)
  - Insert link template
  - Insert image link template
  - Insert table template
  - Insert horizontal line
  - Toggle inline code fragment (for **selection**)
  - Insert (if possible toggle) code block (for **selection**)
  - Open Markdown Guide
- API for extended editor functionality
  - Undo / Redo
  - Toggle rich-text in editor
  - Possibility to replace given textarea and switch back to this native textarea later
  - Side-by-side preview (with editor **or** textarea)
  - Full-width preview
  - Auto-formatting (indentation, empty lines ...)
  - Edit as HTML
  - Download / Save as...
  - Import file
  - Upload image (storage needs to be specified by app developer)
  - set spellchecker language
  - Toggle scroll sync for side-by-side preview
- API for developers only
  - Set/get content
  - Set/get unformatted content
  - emit error
  - get character/word count
  - get line/column cursor position
  - reveal Codemirror instance
  - is dirty
- Customizable options
  - Action short cuts
  - Editor short cuts?
  - Renderer + options
  - Auto-formatting options
  - Autofocus
  - Block styles (e.g. * or _ for italic)
  - Force sync with original textarea
  - Custom templates for templated functions like *Insert link*
  - line wrapping
  - min/max height/width
  - callbacks for all actions
  - custom functions for actions
  - placeholder
  - spellchecker (default/custom)
  - tab size
  - theme name (results in `.cm-s-[name]`)

## Frameworks

- Buttons for all actions
- Default toolbar
- Default tooltips
- Custom toolbar (select which built-in actions to use)
- Custom actions
- Internationalization
- Error handling (default/callback/custom)
- Status bar (character/word count, cursor position, spellchecker language, custom items)
- Set spellchecker language
- Read-only mode (use preview)
- emit change
- emit focus
- emit blur


