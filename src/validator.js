#!/usr/bin/env node
'use strict';

const messages = require("./messages");

const validpriority = (p) => {
    const priority = parseInt(p.substring(2));
    return (priority >= 1 && priority <= 3 && p[0] === 'p');
};

const validString = (s) => {
    return !Number.isInteger(parseInt(s));
};

const validInt = async (num) => {
    if(!Number.isInteger(parseInt(num))) {
        messages.invalid();
        process.exit();
    }
};

const emptyObject = (ob) => {
    if(Object.keys(ob).length === 0) {
        messages.invalid();
        process.exit();
    }
};

const emptyContainer = (list) => {
    if(list.length === 0) {
        messages.taskEmpty();
        process.exit();
    }
};

const validID = (index, list) => {
    if(index > list.length) {
        messages.taskNotFound(index);
        process.exit();
    }
};

module.exports = { 
    validpriority,
    validString, 
    validInt, 
    emptyObject, 
    emptyContainer, 
    validID
};