#!/usr/bin/env node
'use strict';

const Item = require("./item");

class Task extends Item{
    constructor(options = {}) {
        super(options);
        this._type = "TASK";
        this._isComplete = false;
        this._inProgress = false;
        this._isStarred = false;
        this._priority = options.priority || 3;
    }
};

module.exports = Task;