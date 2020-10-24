#!/usr/bin/env node
'use strict';

const os = require("os");
const fs = require("fs");
const { join } = require("path");

const filePath = join(os.homedir(), './taskListner.json');

module.exports = { filePath };