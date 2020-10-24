#!/usr/bin/env node
'use strict';

const currDate = new Date();

const calculateDays = (date) => {
    const prev = new Date(date);
    const time = currDate - prev;
    return Math.floor(time/(1000*3600*24));
};

const structureDate = async (date) => {
    let str = new String(date);
    str = str.substring(0, 15).trim();
    return str;
};

const month = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
};

const monthValue = (mon) => {
    return month[mon];
};

module.exports = { currDate, calculateDays, structureDate, monthValue };