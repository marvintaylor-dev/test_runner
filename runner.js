//This file is responsible primarily for our file collection

//File Collection 
//Find all files in '*.test.js' recursively through a folder
//Store a reference to each file we find
//After full list acquired, execute them one by one

//access to node.js file system
const fs = require('fs');
//access to the path module providing utilities for working with file and directory paths.
const path = require('path');
//add colorization
const chalk = require('chalk');
//import our render logic
const render = require('./render');

//a list of forbidden directories that we do not want to look through
const forbiddenDirs = ['node_modules'];

class Runner {
    constructor() {
        //will hold a reference to every test file we discover
        this.testFiles = [];
    }

    async runTests() {
        for (let file of this.testFiles) {
            //the console log is for the test output
            console.log(chalk.gray(`---- ${file.shortName}`))
            const beforeEaches = [];
            //allows anyone running our code to run render at any point in time. This is loaded in from our render.js file.
            global.render = render;
            //global is used in Node.js. similar to the window. shared between every file
            //in case using 'beforeEach' from mocha gives an error we will define it here.
            global.beforeEach = (fn) => {
                beforeEaches.push(fn)
            };
            //global is used in Node.js. similar to the window. shared between every file
            //in case using 'it' from mocha gives an error we will define it here.
            global.it = async (desc, fn) => {
                //look at every function for errors
                beforeEaches.forEach(func => func());
                //fn is the individual tests being run in the test files. if We fail one, we want to make sure it still runs the others.
                try {
                    //we await our function because some of our tests include asynchronous code which will incorrectly return true because their response is not being awaited.
                    await fn();
                    // the \t in our console log tabs over in our terminal
                    console.log(chalk.green(`\tOK - ${desc}`))
                } catch (err) {
                    //our regex says, for each new line globally. Tab over twice for the error message.
                    const message = err.message.replace(/\n/g, '\n\t\t');
                    console.log(chalk.red(`\tSomething Went Wrong - ${desc}`))
                    console.log(chalk.red('\t', message));
                }
            };


            //to execute or run or test files we use this line of code.
            //we do not use childProcess because that wants to create a new a separate process from the current program we're running.
            //typos won't be caught by the above try catch. So we will use another one here when our code is actually executed.
            try {
                require(file.name)
            } catch (err) {
                console.log(err)
            }
        }
    }

    //gather all files ending with test.js
    async collectFiles(targetPath) {
        //Read Directory, or 'readdir' reads the contents of a directory and resolves with an array of names of the files in the directory. 
        const files = await fs.promises.readdir(targetPath);
        //file will stand for the file OR folder we are iterating over
        //We must determine if something is a file or a folder with lstat; returns a Stats object to tell us if the things we're looking at is a file or folder.
        for (let file of files) {
            //this line gives us an absolute path to the file we're working on.
            //target path ex: /Users/marvintaylor/Desktop/WebDev/Modern_JS_Bootcamp/tme
            //file ex: index.js
            //absolute path ex: /Users/marvintaylor/Desktop/WebDev/Modern_JS_Bootcamp/tme/index.js
            const filepath = await path.join(targetPath, file);
            //look at the stats for the absolute file path we just created
            const stats = await fs.promises.lstat(filepath)
            //see class: fs.Stats docs for full desc.
            //stats comes with methods like isDirectory() and isFile() returning a boolean.

            //if it is a file and the filename includes test.js in the name
            if (stats.isFile() && file.includes('.test.js')) {
                //to have access to the full filename or the shortened name we will create an object with both options
                this.testFiles.push({ name: filepath, shortName: file });
                //if we found another folder and that folder does not include anything from our foribben directories listed at top of page.
            } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
                //run the readdir method again to search through it.
                const childFiles = await fs.promises.readdir(filepath);

                //files ex: ['index.js', 'runner.js'] etc. 
                //childFiles ex: ['app.js', 'banner.js'] etc
                //to avoid this nested array ['index.js', 'runner.js', ['app.js', 'banner.js']] 
                //we use the spread operator to push in each file individually

                //when our childFiles get pushed we have to make sure our absolute paths are including the files before them. So these new folder we find have to be joined like the folders above. using map we iterate over all the files and join the previous absolute file name with the current 
                //in the map statement file is the long path ex: node_modules/mocha/lib
                //in the map statement 'f' is the short file name ex: index.js
                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}

module.exports = Runner;

