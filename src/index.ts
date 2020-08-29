import CodeMirror from 'codemirror';
require('codemirror/mode/gfm/gfm.js');

const codeMirror = CodeMirror(document.body, { mode: 'gfm' });
