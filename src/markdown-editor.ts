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

  /**
   * Toggles "bold" for each selection.
   */
  public toggleBold() {
    this.toggleInlineFormatting('**');
  }

  /**
   * Toggles "italic" for each selection.
   */
  public toggleItalic() {
    this.toggleInlineFormatting('*');
  }

  /**
   * Toggles "strikethrough" for each selection.
   */
  public toggleStrikethrough() {
    this.toggleInlineFormatting('~~');
  }

  /**
   * Toggles "inline code" for each selection.
   */
  public toggleInlineCode() {
    this.toggleInlineFormatting('`');
  }

  /**
   * Toggles inline formatting for each selection by wrapping and unwrapping each selection
   * with specified token.
   * @param token the token
   */
  private toggleInlineFormatting(token: string) {
    const newSelections: CodeMirror.Range[] = [];
    const selections = _.cloneDeep(this.cm.listSelections());
    for (let i = 0; i < selections.length; i++) {
      const oldSelection = selections[i];
      const newSelection = _.cloneDeep(oldSelection);

      const from = oldSelection.from();
      const to = oldSelection.to();
      const endLineLength = this.cm.getLine(to.line).length;
      const prefixStart = { line: from.line, ch: from.ch >= token.length ? from.ch - token.length : 0 };
      const suffixEnd = {
        line: to.line,
        ch: to.ch <= endLineLength - token.length ? to.ch + token.length : endLineLength,
      };

      // Insert or delete tokens depending whether they exist

      const hasPrefixToken = this.cm.getRange(prefixStart, from) === token;
      const hasSuffixToken = this.cm.getRange(to, suffixEnd) === token;

      // indicate whether the tokens before/after the selection have been inserted or deleted
      let beforeShift = 0;
      let afterShift = 0;

      if (hasSuffixToken) {
        this.cm.replaceRange('', to, suffixEnd, '+toggleBlock');
        afterShift = -1;
      } else {
        this.cm.replaceRange(token, to, undefined, '+toggleBlock');
        afterShift = 1;
      }

      if (hasPrefixToken) {
        this.cm.replaceRange('', prefixStart, from, '+toggleBlock');
        beforeShift = -1;
      } else {
        this.cm.replaceRange(token, from, undefined, '+toggleBlock');
        beforeShift = 1;
      }

      // Adjust selections to originally selected characters
      if (oldSelection.empty()) newSelection.head = newSelection.anchor;
      else if (from.line === to.line) newSelection.to().ch += beforeShift * token.length;
      newSelection.from().ch += beforeShift * token.length;

      newSelections.push(newSelection);

      // Adjust all following selections to originally selected characters
      for (let j = i + 1; j < selections.length; j++) {
        const s = selections[j];
        if (s.empty()) {
          s.head = s.anchor;
        } else {
          if (s.head.line === from.line) s.head.ch += beforeShift * token.length;
          if (s.head.line === to.line) s.head.ch += afterShift * token.length;
        }
        if (s.anchor.line === from.line) s.anchor.ch += beforeShift * token.length;
        if (s.anchor.line === to.line) s.anchor.ch += afterShift * token.length;
        else break;
      }
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+toggleBlock' });
    this.cm.focus();
  }

  /**
   * Sets the specified heading level for each selected line. If `level` is 0, the heading token is removed.
   * @param level the heading level
   */
  public setHeadingLevel(level: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
    const headingToken = '#'.repeat(level) + (level === 0 ? '' : ' ');
    this.replaceTokenAtLineStart((oldLineContent) => oldLineContent.replace(/^((#)*( )?)/, headingToken));
  }

  /**
   * Toggles "quote" for each selected line.
   */
  public toggleQuote() {
    this.replaceTokenAtLineStart((oldLineContent) => {
      // Has selected line a quote token?
      if (oldLineContent.search(/^>(\t| )*/) === -1) {
        return '> ' + oldLineContent;
      } else {
        return oldLineContent.replace(/^>(\t| )*/, '');
      }
    });
  }

  /**
   * Toggles "unordered list" for each selected line. Furthermore, a selected ordered list line is
   * transformed to an unordered list.
   */
  public toggleUnorderedList() {
    this.replaceTokenAtLineStart((oldLineContent) => {
      // Has selected line a bullet point token?
      if (oldLineContent.search(MarkdownEditor.UNORDERED_LIST_PATTERN) === -1) {
        const token = '- ';
        // Has selected line an enumeration token?
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

  /**
   * Toggles "ordered list" for each selected line. Furthermore, a selected unordered list line is
   * transformed to an ordered list. Additionally adjusts the subsequent lines that are connected
   * to the list of the selected line.
   */
  public toggleOrderedList() {
    this.replaceTokenAtLineStart((oldLineContent, lineNumber) => {
      // Has selected line an enumeration token?
      if (oldLineContent.search(MarkdownEditor.ORDERED_LIST_PATTERN) === -1) {
        const prevLine = this.cm.getLine(lineNumber - 1);
        let listNumber: number;

        // Is previous line already enumerated list? -> Determine enumeration token for selected line
        if (!prevLine || prevLine.search(MarkdownEditor.ORDERED_LIST_PATTERN) === -1) {
          listNumber = 1;
        } else {
          const dotPos = prevLine.search(/\./);
          listNumber = +prevLine.substring(0, dotPos) + 1;
        }
        this.processNextLinesOfOrderedList(lineNumber, listNumber);
        const numberToken = listNumber + '. ';

        // Has selected line a bullet point token?
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

  /**
   * Adjusts enumeration of subsequent lines in same ordered list as line *baseLineNumber*.
   * @param baseLineNumber the selected line which is toggled
   * @param baseListNumber the list number of the selected line (should be 0, if list starts after selected line)
   */
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

  /**
   * Replaces each selected line with the result of the callback function `replaceFn`.
   * Additionally adjusts the selection boundaries to the originally selected boundaries.
   * @param replaceFn callback function to the calculate the line replacements
   */
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

        // Set shifts for selection start and end
        if (lineNumber === selection.from().line) {
          shiftFrom = newLineContent.length - oldLineContent.length;
        }
        if (lineNumber === selection.to().line) {
          shiftTo = newLineContent.length - oldLineContent.length;
        }
      }
      // Adjust selection boundaries to originally selected boundaries
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

  /**
   * Wraps each selection with code block tokens, which are inserted in separate lines.
   */
  public insertCodeBlock() {
    const newSelections: CodeMirror.Range[] = [];
    const selections = _.cloneDeep(this.cm.listSelections());
    for (let i = 0; i < selections.length; i++) {
      const oldSelection = selections[i];
      const newSelection = _.cloneDeep(oldSelection);

      // Wrap selection with code block tokens
      let currentShift = 3;
      let startToken = '```\n';
      if (newSelection.from().ch > 0) {
        startToken = '\n' + startToken;
        currentShift++;
      }
      this.cm.replaceRange('\n```\n', newSelection.to(), undefined, '+insertCodeBlock');
      this.cm.replaceRange(startToken, newSelection.from(), undefined, '+insertCodeBlock');

      // Adjust selections to originally selected characters
      const offset = newSelection.from().line === newSelection.to().line ? newSelection.from().ch : 0;
      if (!newSelection.empty()) {
        newSelection.to().line += currentShift - 2;
        newSelection.to().ch -= offset;
      } else {
        // fix for edge case bug of empty selection with not synchronous anchor and head
        newSelection.anchor = newSelection.head;
      }
      newSelection.from().line += currentShift - 2;
      newSelection.from().ch = 0;
      newSelections.push(newSelection);

      // Adjust all following selections to originally selected characters
      for (let j = i + 1; j < selections.length; j++) {
        const s = selections[j];
        const remainderIndex = oldSelection.to().ch;
        if (s.from().line === oldSelection.to().line) {
          s.from().ch -= remainderIndex;
        }
        if (s.to().line === oldSelection.to().line) {
          s.to().ch -= remainderIndex;
        }
        if (!s.empty()) s.to().line += currentShift;
        s.from().line += currentShift;
      }
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+insertCodeBlock' });
    this.cm.focus();
  }

  public insertLink() {
    this.insertInlineTemplate('[', '](https://)');
  }

  public insertImageLink() {
    this.insertInlineTemplate('![', '](https://)');
  }

  private insertInlineTemplate(before: string, after: string) {
    const newSelections: CodeMirror.Range[] = [];
    const selections = this.cm.listSelections();
    for (let i = 0; i < selections.length; i++) {
      const oldSelection = selections[i];
      const newSelection = _.cloneDeep(oldSelection);

      // Insert template parts before and after the selection
      this.cm.replaceRange(after, newSelection.to(), undefined, '+toggleBlock');
      this.cm.replaceRange(before, newSelection.from(), undefined, '+toggleBlock');

      // Adjust selections to originally selected characters
      if (!newSelection.empty()) newSelection.to().ch += before.length;
      newSelection.from().ch += before.length;

      newSelections.push(newSelection);

      // Adjust all following selections to originally selected characters
      for (let j = i + 1; j < selections.length; j++) {
        const s = selections[j];
        if (s.empty()) {
          s.head = s.anchor;
        } else {
          if (s.head.line === oldSelection.from().line) s.head.ch += before.length;
          if (s.head.line === oldSelection.to().line) s.head.ch += after.length;
        }
        if (s.anchor.line === oldSelection.from().line) s.anchor.ch += before.length;
        if (s.anchor.line === oldSelection.to().line) s.anchor.ch += after.length;
        else break;
      }
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+toggleBlock' });
    this.cm.focus();
  }

  public insertHorizontalLine() {
    this.insertBlockTemplateBelow('\n-----\n\n');
  }

  public insertTable(rows = 1, columns = 2) {
    let template = '\n';
    for (let c = 1; c <= columns; c++) {
      template += `| Column ${c} `;
    }
    template += '|\n';
    for (let c = 1; c <= columns; c++) {
      template += '| -------- ';
    }
    template += '|\n';
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        template += '| Content  ';
      }
      template += '|\n';
    }
    template += '\n';
    this.insertBlockTemplateBelow(template);
  }

  private insertBlockTemplateBelow(template: string) {
    let currentShift = 0; // indicates how many lines have been inserted
    const selections = this.cm.listSelections();
    for (let i = 0; i < selections.length; i++) {
      const oldSelection = selections[i];
      const newSelection = _.cloneDeep(oldSelection);

      // Shift selection back to correct position in respect to previously inserted lines
      if (newSelection.empty()) newSelection.head = newSelection.anchor;
      else newSelection.to().line += currentShift;
      newSelection.from().line += currentShift;

      const toLineNumber = newSelection.to().line;
      const toLineLength = this.cm.getLine(toLineNumber).length;
      const toLineEnd: CodeMirror.Position = { line: toLineNumber, ch: toLineLength };

      if (toLineLength > 0) {
        template = '\n' + template;
      }
      currentShift += template.match(/\n/g)?.length || 0;

      // Insert template in the subsequent line of the selection
      this.cm.replaceRange(template, toLineEnd, undefined, '+insertHorizontalLine');
    }

    this.cm.focus();
  }

  public openMarkdownGuide() {
    window.open('https://www.markdownguide.org/basic-syntax/', '_blank');
  }
}
