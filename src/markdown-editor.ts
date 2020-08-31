import CodeMirror from 'codemirror';
require('codemirror/mode/gfm/gfm.js');
import _ from 'lodash';

export class MarkdownEditor {
  public static readonly ORDERED_LIST_PATTERN = /^(\d)+\.(\t| )+/;
  public static readonly UNORDERED_LIST_PATTERN = /^(\*|-)(\t| )+/;

  private cm: CodeMirror.Editor;
  private cmOptions: CodeMirror.EditorConfiguration;

  constructor(hostElement: HTMLElement) {
    this.cmOptions = {
      mode: 'gfm',
    };
    this.cm = CodeMirror(hostElement, this.cmOptions);
  }

  static fromTextarea(textarea: HTMLTextAreaElement) {
    CodeMirror.fromTextArea(textarea, { mode: 'gfm' });
  }

  public toggleBold() {
    this.toggleBlock('**');
  }

  public toggleItalic() {
    this.toggleBlock('*');
  }

  public toggleStrikethrough() {
    this.toggleBlock('~~');
  }

  public toggleInlineCode() {
    this.toggleBlock('`');
  }

  private toggleBlock(op: string) {
    const newSelections: CodeMirror.Range[] = [];
    let currentShift = 0; // indicates how many operators have been inserted and deleted
    for (const sel of this.cm.listSelections()) {
      const selection: CodeMirror.Range = _.cloneDeep(sel);

      // Shift selection back to correct position in respect to previously inserted/deleted operators
      selection.anchor.ch += currentShift * op.length;
      selection.head.ch += currentShift * op.length;

      const from = selection.from();
      const to = selection.to();
      const endLineLength = this.cm.getLine(to.line).length;
      const prefixStart = { line: from.line, ch: from.ch >= op.length ? from.ch - op.length : 0 };
      const suffixEnd = { line: to.line, ch: to.ch <= endLineLength - op.length ? to.ch + op.length : endLineLength };

      // Insert or delete tokens depending whether they exist

      const hasPrefixToken = this.cm.getRange(prefixStart, from) === op;
      const hasSuffixToken = this.cm.getRange(to, suffixEnd) === op;

      if (hasSuffixToken) {
        this.cm.replaceRange('', to, suffixEnd, '+toggleBlock');
        currentShift--;
      } else {
        this.cm.replaceRange(op, to, undefined, '+toggleBlock');
        currentShift++;
      }

      if (hasPrefixToken) {
        this.cm.replaceRange('', prefixStart, from, '+toggleBlock');
        selection.anchor.ch -= op.length;
        if (!selection.empty()) selection.head.ch -= op.length;
        currentShift--;
      } else {
        this.cm.replaceRange(op, from, undefined, '+toggleBlock');
        selection.anchor.ch += op.length;
        if (!selection.empty()) selection.head.ch += op.length;
        currentShift++;
      }

      newSelections.push(selection); // Adjust selections to originally selected characters
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+toggleBlock' });
    this.cm.focus();
  }

  public setHeadingLevel(level: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    const headingToken = '#'.repeat(level) + (level === 0 ? '' : ' ');
    this.replaceTokenAtLineStart((oldLineContent) => oldLineContent.replace(/^((#)*( )?)/, headingToken));
  }

  public toggleQuote() {
    this.replaceTokenAtLineStart((oldLineContent) => {
      if (oldLineContent.search(/^>(\t| )*/) === -1) {
        return '> ' + oldLineContent;
      } else {
        return oldLineContent.replace(/^>(\t| )*/, '');
      }
    });
  }

  public toggleUnorderedList() {
    this.replaceTokenAtLineStart((oldLineContent) => {
      if (oldLineContent.search(MarkdownEditor.UNORDERED_LIST_PATTERN) === -1) {
        const token = '- ';
        if (oldLineContent.search(MarkdownEditor.ORDERED_LIST_PATTERN) === -1) {
          return token + oldLineContent;
        } else {
          return oldLineContent.replace(MarkdownEditor.ORDERED_LIST_PATTERN, token);
        }
      } else {
        return oldLineContent.replace(MarkdownEditor.UNORDERED_LIST_PATTERN, '');
      }
    });
  }

  public toggleOrderedList() {
    this.replaceTokenAtLineStart((oldLineContent, lineNumber) => {
      if (oldLineContent.search(MarkdownEditor.ORDERED_LIST_PATTERN) === -1) {
        const prevLine = this.cm.getLine(lineNumber - 1);
        let listNumber: number;
        if (!prevLine || prevLine.search(MarkdownEditor.ORDERED_LIST_PATTERN) === -1) {
          listNumber = 1;
        } else {
          const dotPos = prevLine.search(/\./);
          listNumber = +prevLine.substring(0, dotPos) + 1;
        }
        this.processNextLinesOfOrderedList(lineNumber, listNumber);
        const numberToken = listNumber + '. ';
        if (oldLineContent.search(MarkdownEditor.UNORDERED_LIST_PATTERN) === -1) {
          return numberToken + oldLineContent;
        } else {
          return oldLineContent.replace(MarkdownEditor.UNORDERED_LIST_PATTERN, numberToken);
        }
      } else {
        this.processNextLinesOfOrderedList(lineNumber, 0);
        return oldLineContent.replace(MarkdownEditor.ORDERED_LIST_PATTERN, '');
      }
    });
  }

  private processNextLinesOfOrderedList(baseLineNumber: number, baseListNumber: number) {
    let listNumber = baseListNumber;
    let nextLineNumber = baseLineNumber + 1;
    let nextLine = this.cm.getLine(nextLineNumber);
    while (nextLine && nextLine.search(MarkdownEditor.ORDERED_LIST_PATTERN) !== -1) {
      const listNumberString = `${++listNumber}`;
      const dotPos = nextLine.search(/\./);
      this.cm.replaceRange(
        listNumberString,
        { line: nextLineNumber, ch: 0 },
        { line: nextLineNumber, ch: dotPos },
        '+replaceTokenAtLineStart'
      );
      nextLine = this.cm.getLine(++nextLineNumber);
    }
  }

  private replaceTokenAtLineStart(replaceFn: (oldLineContent: string, lineNumber: number) => string) {
    const newSelections: CodeMirror.Range[] = [];
    for (const sel of this.cm.listSelections()) {
      const selection = _.cloneDeep(sel);
      let shiftFrom = 0;
      let shiftTo = 0;
      for (let lineNumber = selection.from().line; lineNumber <= selection.to().line; lineNumber++) {
        const oldLineContent = this.cm.getLine(lineNumber);
        const newLineContent = replaceFn(oldLineContent, lineNumber);
        this.cm.replaceRange(
          newLineContent,
          { line: lineNumber, ch: 0 },
          { line: lineNumber, ch: oldLineContent.length },
          '+replaceTokenAtLineStart'
        );

        if (lineNumber === selection.from().line) {
          shiftFrom = newLineContent.length - oldLineContent.length;
        }
        if (lineNumber === selection.to().line) {
          shiftTo = newLineContent.length - oldLineContent.length;
        }
      }
      if (_.isEqual(selection.anchor, selection.from())) {
        selection.anchor.ch += shiftFrom;
        if (!selection.empty()) selection.head.ch += shiftTo;
      } else {
        selection.anchor.ch += shiftTo;
        if (!selection.empty()) selection.head.ch += shiftFrom;
      }
      newSelections.push(selection);
    }

    this.cm.setSelections(newSelections, undefined, { origin: 'replaceTokenAtLineStart' });
    this.cm.focus();
  }

  public insertCodeBlock() {
    const newSelections: CodeMirror.Range[] = [];
    let lineShift = 0;
    for (const sel of this.cm.listSelections()) {
      const selection = _.cloneDeep(sel);

      // Shift selection back to correct position in respect to previously inserted/deleted operators
      selection.anchor.line += lineShift;
      selection.head.line += lineShift;

      let currentShift = 3;
      let startToken = '```\n';
      if (selection.from().ch > 0) {
        startToken = '\n' + startToken;
        currentShift++;
      }
      this.cm.replaceRange('\n```\n', selection.to(), undefined, '+insertCodeBlock');
      this.cm.replaceRange(startToken, selection.from(), undefined, '+insertCodeBlock');
      lineShift += currentShift;

      const offset = selection.from().ch;
      console.log(JSON.stringify(selection));
      if (!selection.empty()) {
        selection.to().line += currentShift - 2;
        selection.to().ch -= offset;
      } else {
        // fix for edge case bug of empty selection with not synchronous anchor and head
        selection.anchor = selection.head;
      }
      selection.from().line += currentShift - 2;
      selection.from().ch = 0;
      console.log(JSON.stringify(selection));
      newSelections.push(selection);
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+insertCodeBlock' });
    this.cm.focus();
  }
}
