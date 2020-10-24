#!/usr/bin/env node
'use strict';

const Item = require("./item");

class Note extends Item{
    constructor(options = {}) {
        super(options);
        this._type = "NOTE";
        this._isStarred = false;
        this._priority = options.priority || 3;
    }
};

module.exports = Note;