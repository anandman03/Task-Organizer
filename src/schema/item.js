#!/usr/bin/env node
'use strict';

const date = require("../helpers/getDate");

class Item {
    constructor(options = {}) {
        this._id = options.id || 1;
        this._description = options.description;
        this._date = String(date.currDate);
        this._board = options.board || "Default";
    }
};

module.exports = Item;