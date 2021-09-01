const assert = require('assert');
const render = require('../../render');

it('has a text input', async () => {
    //call our render function created in render.js and save it to dom
    const dom = await render('index.html');

    //access the input through the virtual dom from js dom
    const input = dom.window.document.querySelector('input');

    //when you call assert with an input it will return an error if the input is falsey
    assert(input)
})

it('shows a success message with a valid email', async () => {
    //call our render function created in render.js and save it to dom
    const dom = await render('index.html');
    //access the input through the virtual dom from js dom
    const input = dom.window.document.querySelector('input');
    //set the input value
    input.value = 'test@testmail.com';
    //access the virtual dom form and trigger an event
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));

    //access the h1
    const h1 = dom.window.document.querySelector('h1');

    //does our h1 innerHTML match the words from index.js.  header.innerHTML = 'Looks Good!';
    assert.strictEqual(h1.innerHTML, 'Looks Good!');
})

it('shows a fail message with an invalid email', async () => {
    //call our render function created in render.js and save it to dom
    const dom = await render('index.html');
    //access the input through the virtual dom from js dom
    const input = dom.window.document.querySelector('input');
    //set the input value. In this case the @ is missing. Should return invalid
    input.value = 'ttestmail.com';
    //access the virtual dom form and trigger an event
    dom.window.document
        .querySelector('form')
        .dispatchEvent(new dom.window.Event('submit'));

    //access the h1
    const h1 = dom.window.document.querySelector('h1');

    //does our h1 innerHTML match the words from index.js.  header.innerHTML = 'Invalid Email';
    assert.strictEqual(h1.innerHTML, 'Invalid Email');
})