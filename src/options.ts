export interface Options {
  autofocus: boolean;
  lineWrapping: boolean;
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
  shortcuts: {
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
  };
  tabSize: number;
  theme: string; // "example-theme" results in ".cm-s-example-theme"; "foo bar" in ".cm-s-foo .cm-s-bar"
}

export const DEFAULT_OPTIONS: Options = {
  autofocus: true,
  lineWrapping: true,
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
    insertHorizontalLine: 'Ctrl--',
    toggleInlineCode: 'Ctrl-7',
    insertCodeBlock: 'Shift-Ctrl-7',
    openMarkdownGuide: 'F1',
    toggleRichTextMode: 'Alt-R',
  },
  tabSize: 2,
  theme: '',
};
