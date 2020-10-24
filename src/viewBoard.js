#!/usr/bin/env node
'use strict';

const storage = require("./storage");
const messages = require("./messages");
const validator = require("./validator");
const getDate = require("./helpers/getDate");


let done = 0;
let pending = 0;
let notes = 0;
let inProcess = 0;

const initialise = () => {
    done = pending = notes = inProcess = 0;
};

const calculate = () => {
    let percentCompletion = Math.floor(100*(done/(done + pending)));
    messages.taskCompleteData(percentCompletion);
    messages.overView(done, pending, inProcess, notes);
    messages.newLine();
};

const findItem = async (item) => {
    const value = item.join(' ').trim();
    if(Number.isInteger(parseInt(value))) {
        await viewTask(Number(value));
    }
    else {
        await viewBoard(String(value));
    }
};

const viewTimeline = async () => {
    let list = await storage.getTaskList();
    validator.emptyContainer(list);
    initialise();

    const dates = new Set();
    for(let task of list) {
        task._date = await getDate.structureDate(task._date);
        dates.add(task._date);
    }
    let uniqueDates = [];
    for(const date of dates) {
        uniqueDates.push(date);
    }
    uniqueDates.sort((d1, d2) => {
        let m1 = getDate.monthValue(d1.substring(4, 7));
        let m2 = getDate.monthValue(d2.substring(4, 7));
        if(parseInt(m1) == parseInt(m2)) {
            let day1 = Number(d1.substring(8, 10));
            let day2 = Number(d2.substring(8, 10));
            return day1 - day2;
        }
        return m1 - m2;
    });

    for(let date of uniqueDates)
    {
        messages.boardTitle(date);
        for(const item of list)
        {
            if(date === item._date) 
            {
                const task = await makeObject(item);
                messages.viewTask(task, item._type);
                
                if(item._inProgress === true) {
                    inProcess += 1;
                }
                if(item._type === "NOTE") {
                    notes += 1;
                }
                else if(item._isComplete === true) {
                    done += 1;
                }
                else {
                    pending += 1;
                }
            }
        }
    }
    calculate();
};

const displayItems = async () => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);
    initialise();

    const dashBoards = new Set();
    for(const task of list) {
        dashBoards.add(task._board);
    }
    for(const board of dashBoards) 
    {
        messages.boardTitle(board);
        for(const item of list) 
        {
            if(board === item._board) 
            {
                const task = await makeObject(item);
                messages.viewTask(task, item._type);

                if(item._inProgress === true) {
                    inProcess += 1;
                }
                if(item._type === "NOTE") {
                    notes += 1;
                }
                else if(item._isComplete === true) {
                    done += 1;
                }
                else {
                    pending += 1;
                }
            }
        }
    }
    calculate();
};

const listItems = async (item) => {
    let str = String(item.join()).trim();
    if(str === "done") {
        await doneTask();
    }
    if(str === "pending") {
        await pendingTask();
    }
    if(str === "in-progress") {
        await inProgressTask();
    }
    if(str === "notes") {
        await getNotes();
    }
};

const doneTask = async () => {
    const list = await storage.getTaskList();
    initialise();

    for(const item of list) {
        if(item._isComplete === true) {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
            done += 1;
        }
        else {
            pending += 1;
        }
        if(item._inProgress === true) {
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            notes += 1;
        }
    }
    if(done === 0) {
        messages.notFound();
    }
    calculate();
};

const pendingTask = async () => {
    const list = await storage.getTaskList();
    initialise();
    messages.newLine();

    for(const item of list) {
        if(item._isComplete !== true) {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
            pending += 1;
        }
        else {
            done += 1;
        }
        if(item._inProgress === true) {
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            notes += 1;
        }
    }
    if(pending === 0) {
        messages.notFound();
    }
    calculate();
};

const inProgressTask = async () => {
    const list = await storage.getTaskList();
    initialise();

    for(const item of list) {
        if(item._isComplete !== true) {
            pending += 1;
        }
        else {
            done += 1;
        }
        if(item._inProgress === true) {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            notes += 1;
        }
    }
    if(inProcess === 0) {
        messages.notFound();
    }
    calculate();
};

const getNotes = async () => {
    const list = await storage.getTaskList();
    initialise();

    for(const item of list) {
        if(item._isComplete !== true) {
            pending += 1;
        }
        else {
            done += 1;
        }
        if(item._inProgress === true) {
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
            notes += 1;
        }
    }
    if(notes === 0) {
        messages.notFound();
    }
    calculate();
};

const viewTask = async (value) => {
    const list = await storage.getTaskList();
    initialise();

    validator.validID(value, list);
    messages.newLine();

    for(const item of list) {
        if(value == item._id) {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
        }
        if(item._inProgress === true) {
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            notes += 1;
        }
        else if(item._isComplete === true) {
            done += 1;
        }
        else {
            pending += 1;
        }
    }
    calculate();
};

const viewBoard = async (value) => {
    const list = await storage.getTaskList();
    initialise();

    let found = false;
    for(const item of list) {
        if(item._board == value) {
            found = true;
        }
    }
    if(found === false) {
        messages.boardNotFound();
        process.exit();
    }

    messages.boardTitle(value);
    for(const item of list) {
        if(value == item._board) {
            const task = await makeObject(item);
            messages.viewTask(task, item._type);
        }
        if(item._inProgress === true) {
            inProcess += 1;
        }
        if(item._type === "NOTE") {
            notes += 1;
        }
        else if(item._isComplete === true) {
            done += 1;
        }
        else {
            pending += 1;
        }
    }
    calculate();
};

const makeObject = async (item) => {
    const task = {
        id: item._id,
        desc: item._description,
        days: getDate.calculateDays(item._date),
        star: Boolean(item._isStarred),
        done: Boolean(item._isComplete) || false,
        priority: Number(item._priority),
        inProgress: Boolean(item._inProgress),
    };
    return task;
};


module.exports = {
    findItem,
    listItems,
    viewTimeline,
    displayItems,
};