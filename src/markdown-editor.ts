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
        selection.head.ch -= op.length;
        currentShift--;
      } else {
        this.cm.replaceRange(op, from, undefined, '+toggleBlock');
        selection.anchor.ch += op.length;
        selection.head.ch += op.length;
        currentShift++;
      }

      newSelections.push(selection); // Adjust selections to originally selected characters
    }

    this.cm.setSelections(newSelections, undefined, { origin: '+toggleBlock' });
    this.cm.focus();
  }
}
