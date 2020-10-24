#!/usr/bin/env node
'use strict';

const meow = require("meow");
const help = require("./src/helpers/help");
const taskListner = require("./index");

const cli = meow(help, {
    flags: {
        help: {
            type: "boolean",
            alias: "h"
        },
        version: {
            type: "boolean",
            alias: "v"
        },
        task: {
            type: "boolean",
            alias: "t"
        },
        note: {
            type: "boolean",
            alias: "n"
        },
        remove: {
            type: "boolean",
            alias: "r"
        },
        done: {
            type: "boolean",
            alias: "d"
        },
        priority: {
            type: "boolean",
            alias: "p"
        },
        board: {
            type: "boolean",
            alias: "b"
        },
        edit: {
            type: "boolean",
            alias: "e"
        },
        move: {
            type: "boolean",
            alias: "m"
        },
        find: {
            type: "boolean",
            alias: "f"
        },
        star: {
            type: "boolean",
            alias: "s"
        },
        copy: {
            type: "boolean",
            alias: "c"
        },
        unpin: {
            type: "boolean",
            alias: "u"
        },
        timeline: {
            type: "boolean",
            alias: "i"
        },
        begin: {
            type: "boolean",
            alias: "y"
        },
        list: {
            type: "boolean",
            alias: "l"
        },
        erase: {
            type: "boolean"
        }
    }
});

taskListner(cli.flags, cli.input);