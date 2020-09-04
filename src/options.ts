export interface Options {
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
}

export const DEFAULT_OPTIONS: Options = {
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
};
