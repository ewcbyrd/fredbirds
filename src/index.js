// Add process polyfill
if (typeof process === 'undefined') {
    window.process = { env: {}, browser: true };
}

import '@lwc/synthetic-shadow';
import { createElement } from 'lwc';
import MyApp from 'my/app';

const app = createElement('my-app', { is: MyApp });
document.querySelector('#main').appendChild(app);
