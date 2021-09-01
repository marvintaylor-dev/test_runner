#!/usr/bin/env node
//^ allows our program to be run as a CLI tool. Coupled with 'bin' in package.JSON

//This file combines our logic for the implementation plan
//Implementation is as follows: File Collection, Test environment Setup, Test file execution, and Report results.

///File Collection - collection of all files
//Test environment - Make sure we can execute the files and that they have the ability to have browser based JS code inside of them
//Test file execution - where we run our 'it' statements
//Report Results - Tabulated data.

const Runner = require('./runner');
//creates a new runner object
const runner = new Runner();

//we cannot run await in the top level of our program. To call our asynchronous runner we have to wrap it in this function. 
const run = async () => {
    //in order to get know which directory we're searching through we use process.cwd()
    //cwd stands for current working directory
    await runner.collectFiles(process.cwd());
    runner.runTests()
};

run();