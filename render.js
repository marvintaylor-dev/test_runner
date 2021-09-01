//our render file which uses JSDOM to create a virtual representation of the DOM. Allowing us to make browser tests.

const path = require('path')
//access to the jsdom library
//JSDOM gives us a virtual representation of the DOM. Ex: we run JSDOM.fromFile(index.html) index.html has javascript files connected to it. Which allows us to test all of the functionality of the html file.
const jsdom = require('jsdom');
//gives access to creating new JSDOM objects
const { JSDOM } = jsdom;

//we use async because the documentation for JSDOM.fromFile has a .then statement. Meaning it returns a promise. Any time we see that we can use the async / await combination.
const render = async (filename) => {
    //give us access to the full absolute path because we never know where this is going to be run. We want each file to have the full path name.
    const filePath = path.join(process.cwd(), filename);

    //construct a jsdom from a filename
    const dom = await JSDOM.fromFile(filePath, {
        //runScripts dangerously gives any path you run this program on access to your computer. We will only be running this on files we created or from third parties we trust. So we can feel ok using this.
        runScripts: 'dangerously',
        resources: 'usable'
    });

    //we have to delay render function from returning until this dom content loaded has been triggered. 
    //wrapping in a promise means 'let's not resolve the promise until the event is triggered.' 
    return new Promise((resolve, reject) => {
        dom.window.document.addEventListener('DOMContentLoaded', () => {
            //we resolve with dom to make sure dom is accesible outside of the promise
            resolve(dom)
        })
    })
    //return dom used to be here. But because we return the promise above. And the resolved promise returns dom 'resolve(dom)' it's not longer needed
};

module.exports = render;