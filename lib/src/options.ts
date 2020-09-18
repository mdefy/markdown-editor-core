export interface Options {
  autofocus: boolean;
  downloadFileName: string;
  lineWrapping: boolean;
  markdownGuideUrl: string;
  placeholder: string; // | Element;
  preferredTokens: {
    bold: '**' | '__';
    italic: '*' | '_';
    horizontalLine: '---' | '***' | '___';
    codeBlock: '```' | '~~~';
    unorderedList: '-' | '*';
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

export interface MarkdownEditorShortcuts {
  toggleBold: string;
  toggleItalic: string;
  toggleStrikethrough: string;
  toggleUnorderedList: string;
  toggleOrderedList: string;
  toggleCheckList: string;
  toggleQuote: string;
  insertLink: string;
  insertImageLink: string;
  insertTable: string;
  insertHorizontalLine: string;
  toggleInlineCode: string;
  insertCodeBlock: string;
  openMarkdownGuide: string;
  toggleRichTextMode: string;
  downloadAsFile: string;
  importFromFile: string;
  formatContent: string;
}

export const DEFAULT_OPTIONS: Options = {
  autofocus: true,
  downloadFileName: new Date().toISOString().substr(0, 19).replace('T', '_').replace(/:|-/gi, '') + '.md',
  lineWrapping: true,
  markdownGuideUrl: 'https://www.markdownguide.org/basic-syntax/',
  placeholder: '',
  preferredTokens: {
    bold: '**',
    italic: '_',
    horizontalLine: '---',
    codeBlock: '```',
    unorderedList: '-',
  },
  preferredTemplates: {
    link: ['[', '](https://)'],
    imageLink: ['![', '](https://)'],
    table: { rows: 2, columns: 2 },
  },
  richTextMode: true,
  shortcuts: {
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

export interface FromTextareaOptions extends Options {
  autoSync: boolean;
}

export const DEFAULT_FROM_TEXTAREA_OPTIONS: FromTextareaOptions = Object.assign(
  {
    autoSync: true,
  },
  DEFAULT_OPTIONS
);
