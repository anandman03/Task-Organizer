'use strict';

const os = require("os");
const fs = require("fs");
const { join } = require("path");

const filePath = join(os.homedir(), './taskListner.json');

const markerPath = join(os.homedir(), './marker.json');

module.exports = { filePath, markerPath };