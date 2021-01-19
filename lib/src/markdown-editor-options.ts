/**
 * All options to configure `MarkdownEditor`.
 *
 * _Not intended to be used outside of this library. Only made public for access inside `MarkdownEditor`._
 */
export interface MarkdownEditorOptionsComplete {
  /**
   * Specifies whether the editor receives autofocus when page loads.
   * (Applies if no other element holds focus already.)
   */
  autofocus: boolean;

  /**
   * Specifies whether the editor is disabled.
   */
  disabled: boolean;

  /**
   * A function to generate the name of the file that is downloaded when `mde.downloadAsFile()` is called.
   */
  downloadFileNameGenerator: () => string;

  /**
   * Specifies whether markup tokens like `-`, `[]`, etc. get `token` classes, to enable highlighting.
   *
   * @see Our [README section](https://github.com/lenardfunk/markdown-editor-core/#how-to-change-the-markup-styling-eg-heading-bold-) for more details.
   */
  highlightTokens: boolean;

  /**
   * Specifies whether lineNumbers are shown on the left side of the editor.
   */
  lineNumbers: boolean;

  /**
   * Specifies whether line wrapping is enabled inside the editor.
   */
  lineWrapping: boolean;

  /**
   * The url to which `mde.openMarkdownGuide()` redirects.
   */
  markdownGuideUrl: string;

  /**
   * Specifies whether multiple cursors are allowed in the editor.
   * If `true`, additional cursors are added by _Ctrl-Leftclick_.
   */
  multipleCursors: boolean;

  /**
   * The placeholder shown in the editor when it is empty.
   */
  placeholder: string;

  /**
   * Preferred tokens for every format markup that allows different markup styles.
   */
  preferredTokens: {
    bold: '**' | '__';
    italic: '*' | '_';
    horizontalRule: '---' | '***' | '___';
    codeBlock: '```' | '~~~';
    unorderedList: '-' | '*';
    checkList: '-' | '*'; // results in `- [x]`  OR  `* [x]`
  };

  /**
   * Preferred templates that are inserted on the corresponding actions.
   */
  preferredTemplates: {
    link: [string, string];
    imageLink: [string, string];
    table: string | { rows: number; columns: number };
  };

  /**
   * Specifies whether Markdown syntax highlight is enabled.
   * If true, the _CodeMirror_ mode [`gfm`](https://codemirror.net/mode/gfm/index.html)
   * is applied, if `false` no mode is applied.
   */
  richTextMode: boolean;

  /**
   * Keyboard shortcuts for built-in actions.
   *
   * @see Our [README section](https://github.com/lenardfunk/markdown-editor-core/#shortcuts) for more details.
   */
  shortcuts: MarkdownEditorShortcuts;

  /**
   * Specifies whether default shortcuts are applied or any shortcuts are applied at all.
   * - `all`: custom and default keybindings are applied
   * - `customOnly`: only explicitly specified keybindings in `options.shortcuts` are applied,
   * - `none`: no keybindings are applied at all
   */
  shortcutsEnabled: 'all' | 'customOnly' | 'none';

  /**
   * The width of a tab character (in number of "normal" characters, e.g. spaces).
   */
  tabSize: number;

  /**
   * Names of CSS themes to style the editor. Results in `.cm-s-[theme-name]` applied to `<div class="CodeMirror">`.
   *
   * @see Our [README section](https://github.com/lenardfunk/markdown-editor-core/#theming) for more details.
   */
  themes: string[]; // "example-theme" results in ".cm-s-example-theme"; "foo bar" in ".cm-s-foo .cm-s-bar"
}

/**
 * Options to configure `MarkdownEditor`.
 */
export type MarkdownEditorOptions = DeepPartial<MarkdownEditorOptionsComplete>;

/**
 * Predefined action name.
 */
export type MarkdownEditorAction =
  | 'setHeadingLevel'
  | 'increaseHeadingLevel'
  | 'decreaseHeadingLevel'
  | 'toggleBold'
  | 'toggleItalic'
  | 'toggleStrikethrough'
  | 'toggleUnorderedList'
  | 'toggleOrderedList'
  | 'toggleCheckList'
  | 'toggleQuote'
  | 'insertLink'
  | 'insertImageLink'
  | 'insertTable'
  | 'insertHorizontalRule'
  | 'toggleInlineCode'
  | 'insertCodeBlock'
  | 'openMarkdownGuide'
  | 'toggleRichTextMode'
  | 'downloadAsFile'
  | 'importFromFile'
  | 'formatContent';

/**
 * Keyboard shortcut definition for built-in action.
 */
export type MarkdownEditorShortcuts = Partial<Record<Exclude<MarkdownEditorAction, 'setHeadingLevel'>, string>>;

/**
 * Default configuration for `MarkdownEditor`.
 */
export const DEFAULT_OPTIONS: MarkdownEditorOptionsComplete = {
  autofocus: true,
  disabled: false,
  downloadFileNameGenerator: () => {
    const now = new Date();
    const shift = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return shift.toISOString().substr(0, 19).replace('T', '_').replace(/:|-/gi, '') + '.md';
  },
  highlightTokens: false,
  lineNumbers: false,
  lineWrapping: true,
  markdownGuideUrl: 'https://www.markdownguide.org/basic-syntax/',
  multipleCursors: true,
  placeholder: '',
  preferredTokens: {
    bold: '**',
    italic: '_',
    horizontalRule: '---',
    codeBlock: '```',
    unorderedList: '-',
    checkList: '-',
  },
  preferredTemplates: {
    link: ['[', '](https://)'],
    imageLink: ['![', '](https://)'],
    table: { rows: 2, columns: 2 },
  },
  richTextMode: true,
  shortcuts: {
    increaseHeadingLevel: 'Alt-H',
    decreaseHeadingLevel: 'Shift-Alt-H',
    toggleBold: 'Ctrl-B',
    toggleItalic: 'Ctrl-I',
    toggleStrikethrough: 'Ctrl-K',
    toggleUnorderedList: 'Ctrl-L',
    toggleOrderedList: 'Shift-Ctrl-L',
    toggleCheckList: 'Shift-Ctrl-Alt-L',
    toggleQuote: 'Ctrl-Q',
    insertLink: 'Ctrl-M',
    insertImageLink: 'Shift-Ctrl-M',
    insertTable: 'Ctrl-Alt-T',
    insertHorizontalRule: 'Shift-Ctrl--',
    toggleInlineCode: 'Ctrl-7',
    insertCodeBlock: 'Shift-Ctrl-7',
    openMarkdownGuide: 'F1',
    toggleRichTextMode: 'Alt-R',
    downloadAsFile: 'Shift-Ctrl-S',
    importFromFile: 'Ctrl-Alt-I',
    formatContent: 'Alt-F',
  },
  shortcutsEnabled: 'all',
  tabSize: 4,
  themes: ['default'],
};

/**
 * All options to configure `MarkdownEditorFromTextarea`.
 *
 * _Not intended to be used outside of this library. Only made public for access inside component._
 */
export interface FromTextareaOptionsComplete extends MarkdownEditorOptionsComplete {
  /**
   * Specifies whether the editor content is automatically synced to the textarea it replaces.
   */
  autoSync: boolean;
}

/**
 * Options to configure `MarkdownEditorFromTextarea`.
 */
export type MdeFromTextareaOptions = DeepPartial<FromTextareaOptionsComplete>;

/**
 * Default configuration for `MarkdownEditorFromTextarea`.
 */
export const DEFAULT_FROM_TEXTAREA_OPTIONS: FromTextareaOptionsComplete = Object.assign(
  {
    autoSync: true,
  },
  DEFAULT_OPTIONS
);

/**
 * Recursive version of TS utility type Partial<T>.
 */
type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};
