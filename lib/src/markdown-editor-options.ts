export interface MarkdownEditorOptionsComplete {
  autofocus: boolean;
  disabled: boolean;
  downloadFileNameGenerator: () => string;
  lineNumbers: boolean;
  lineWrapping: boolean;
  markdownGuideUrl: string;
  placeholder: string; // | Element;
  preferredTokens: {
    bold: '**' | '__';
    italic: '*' | '_';
    horizontalLine: '---' | '***' | '___';
    codeBlock: '```' | '~~~';
    unorderedList: '-' | '*';
    checkList: '-' | '*'; // `- [x]`  OR  `* [x]`
  };
  preferredTemplates: {
    link: [string, string];
    imageLink: [string, string];
    table: string | { rows: number; columns: number };
  };
  richTextMode: boolean;
  shortcuts: MarkdownEditorShortcuts;
  tabSize: number;
  theme: string; // "example-theme" results in ".cm-s-example-theme"; "foo bar" in ".cm-s-foo .cm-s-bar"
}

export type MarkdownEditorOptions = DeepPartial<MarkdownEditorOptionsComplete>;

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
  | 'insertHorizontalLine'
  | 'toggleInlineCode'
  | 'insertCodeBlock'
  | 'openMarkdownGuide'
  | 'toggleRichTextMode'
  | 'downloadAsFile'
  | 'importFromFile'
  | 'formatContent';

export type MarkdownEditorShortcuts = Record<Exclude<MarkdownEditorAction, 'setHeadingLevel'>, string>;

export const DEFAULT_OPTIONS: MarkdownEditorOptionsComplete = {
  autofocus: true,
  disabled: false,
  downloadFileNameGenerator: () => {
    const now = new Date();
    const shift = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return shift.toISOString().substr(0, 19).replace('T', '_').replace(/:|-/gi, '') + '.md';
  },
  lineNumbers: false,
  lineWrapping: true,
  markdownGuideUrl: 'https://www.markdownguide.org/basic-syntax/',
  placeholder: '',
  preferredTokens: {
    bold: '**',
    italic: '_',
    horizontalLine: '---',
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
    insertHorizontalLine: 'Shift-Ctrl--',
    toggleInlineCode: 'Ctrl-7',
    insertCodeBlock: 'Shift-Ctrl-7',
    openMarkdownGuide: 'F1',
    toggleRichTextMode: 'Alt-R',
    downloadAsFile: 'Shift-Ctrl-S',
    importFromFile: 'Ctrl-Alt-I',
    formatContent: 'Alt-F',
  },
  tabSize: 2,
  theme: 'default',
};

export interface FromTextareaOptionsComplete extends MarkdownEditorOptionsComplete {
  autoSync: boolean;
}

export type FromTextareaOptions = DeepPartial<FromTextareaOptionsComplete>;

export const DEFAULT_FROM_TEXTAREA_OPTIONS: FromTextareaOptionsComplete = Object.assign(
  {
    autoSync: true,
  },
  DEFAULT_OPTIONS
);

type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};
