#!/usr/bin/env node
'use strict';

const handler = require("./src/handleEvents");
const display = require("./src/viewBoard");

const taskListner = (flags, input) => {
    if(checkMultipleFlags(flags)) {
        handler.multipleFlags();
    }
    else if(flags.task) {
        handler.createTask(input);
    }
    else if(flags.note) {
        handler.createNote(input);
    }
    else if(flags.remove) {
        handler.removeItem(input);
    }
    else if(flags.done) {
        handler.markDone(parseInt(input[0]));
    }
    else if(flags.priority) {
        handler.changePriority(input);
    }
    else if(flags.board) {
        handler.changeBoard(input);
    }
    else if(flags.edit) {
        handler.editTask(input);
    }
    else if(flags.move) {
        handler.moveItem(input);
    }
    else if(flags.find) {
        display.findItem(input);
    }
    else if(flags.star) {
        handler.starItem(input);
    }
    else if(flags.copy) {
        handler.copyToClipboard(input);
    }
    else if(flags.unpin) {
        handler.unpinItem();
    }
    else if(flags.timeline) {
        display.viewTimeline();
    }
    else if(flags.begin) {
        handler.startTask(input);
    }
    else if(flags.erase) {
        handler.eraseList();
    }
    else if(flags.list) {
        display.listItems(input);
    }
    else {
        display.displayItems();
    }
};

const checkMultipleFlags = (flags) => {
    let counter = 0;
    for(const flag in flags) {
        if(flags[flag] == true) {
            counter += 1;
        }
    }
    return Boolean(counter > 1);
};

module.exports = taskListner;