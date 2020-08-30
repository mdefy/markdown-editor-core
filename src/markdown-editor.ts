import CodeMirror from 'codemirror';
require('codemirror/mode/gfm/gfm.js');
import _ from 'lodash';

export class MarkdownEditor {
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
    const orderedListPattern = /^(\d)+\.(\t| )+/;
    const unorderedListPattern = /^(\*|-)(\t| )+/;
    this.replaceTokenAtLineStart((oldLineContent) => {
      if (oldLineContent.search(unorderedListPattern) === -1) {
        if (oldLineContent.search(orderedListPattern) === -1) {
          return '- ' + oldLineContent;
        } else {
          return oldLineContent.replace(orderedListPattern, '- ');
        }
      } else {
        return oldLineContent.replace(unorderedListPattern, '');
      }
    });
  }

  private replaceTokenAtLineStart(replaceFn: (oldLineContent: string) => string) {
    const newSelections: CodeMirror.Range[] = [];
    for (const sel of this.cm.listSelections()) {
      const selection = _.cloneDeep(sel);
      let shiftFrom = 0;
      let shiftTo = 0;
      for (let lineNumber = selection.from().line; lineNumber <= selection.to().line; lineNumber++) {
        const oldLineContent = this.cm.getLine(lineNumber);
        const newLineContent = replaceFn(oldLineContent);
        this.cm.replaceRange(
          newLineContent,
          { line: lineNumber, ch: 0 },
          { line: lineNumber, ch: oldLineContent.length },
          '+setHeadingLevel'
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

    this.cm.setSelections(newSelections);
    this.cm.focus();
  }
}
