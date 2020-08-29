import { MarkdownEditor } from './markdown-editor';

const mde = new MarkdownEditor(document.body);

document.getElementById('testButton')?.addEventListener('click', () => mde.toggleBold());
