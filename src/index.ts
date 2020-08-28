function init() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerText = 'Markdown Editor works!';

  return element;
}

document.body.appendChild(init());
