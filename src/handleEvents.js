#!/usr/bin/env node
'use strict';

const storage = require("./storage");
const Task = require("./schema/task");
const Note = require("./schema/note");
const messages = require("./messages");
const validator = require("./validator");
const clipboardy = require("clipboardy");


const createTask = async (task) => {
    validator.emptyObject(task);
    const structuredTask = await structureItem(task, "TASK");
    storage.storeItem(structuredTask);
};

const createNote = async (note) => {
    validator.emptyObject(note);
    const structuredNote = await structureItem(note, "NOTE");
    storage.storeItem(structuredNote);
};

const removeItem = async (item) => {
    validator.emptyObject(item);
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    await validator.validInt(item[0]);
    const itemIndex = parseInt(item[0]);
    validator.validID(itemIndex, list);
    
    await storage.deleteItem(itemIndex-1);
};

const markDone = async (ID) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);
    validator.validInt(ID);
    validator.validID(ID, list);
    if(list[ID-1]._type === "NOTE") {
        messages.taskNotFound(ID);
        return;
    }
    await storage.updateCompleteStatus(ID-1);
};

const changePriority = async (item) => {
    const ID = parseInt(item[0]);
    const list = await storage.getTaskList();
    validator.emptyContainer(list);
    validator.validInt(item[0]);
    validator.validID(ID, list);
    if(list[ID-1]._type === "NOTE") {
        messages.notesUpdation();
        return;
    }
    const priority = await getPriority(item);
    if(priority === null) {
        messages.invalid();
        process.exit();
    }
    validator.validInt(priority);
    await storage.updatePriority(ID-1, priority);
};

const changeBoard = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    let currName = await getCurrBoardName(item);
    let found = false;
    for(const item of list) {
        if(item._board == currName) {
            found = true;
        }
    }
    if(found === false) {
        messages.boardNotFound();
        process.exit();
    }
    let newName = await getNewBoardName(item);
    await storage.updateBoard(currName, newName);
};

const editTask = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    let ID = parseInt(item[0]);
    validator.validInt(item[0]);
    validator.validID(ID, list);
    let desc = item.join(' ').substring(1).trim();
    await storage.updateTask(ID-1, desc);
};

const moveItem = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    let ID = parseInt(item[0]);
    validator.validInt(item[0]);
    validator.validID(ID, list);
    let board = item.join(' ').substring(1).trim();
    await storage.updateTaskBoard(ID-1, board);
};

const starItem = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    let ID = parseInt(item[0]);
    validator.validInt(item[0]);
    validator.validID(ID, list);
    let board = item.join(' ').substring(1).trim();
    await storage.updateStarItem(ID-1, board);
};

const copyToClipboard = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    const descriptions = [];
    for(const id of item) {
        validator.validID(id, list);
        validator.validInt(id);
        descriptions.push(list[id-1]._description);
    }
    clipboardy.writeSync(descriptions.join("\n"));
    messages.copiedItem();
};

const unpinItem = async () => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    const modifiedList = [];
    let idCounter = 1;
    for(const item of list) {
        if(item._isComplete === false || item._type === "NOTE") {
            item._id = idCounter;
            idCounter += 1;
            modifiedList.push(item);
        }
        else {
            continue;
        }
    }
    await storage.updateList(modifiedList);
};

const startTask = async (item) => {
    const list = await storage.getTaskList();
    validator.emptyContainer(list);

    const ID = parseInt(item[0]);
    validator.validInt(item[0]);
    validator.validID(ID, list);
    await storage.updateProgress(ID-1);
};

const eraseList = async () => {
    await storage.removeAll();
};


const structureItem = async (item, type) => {
    let newItem = new Object();
    if(type === "NOTE") {
        newItem = new Note();
    }
    else if(type === "TASK") {
        newItem = new Task();
    }

    const list = await storage.getTaskList();
    newItem._id = list.length + 1;
 
    const desc = await getDescription(item);
    validator.emptyContainer(desc);
    newItem._description = desc;

    const db = await getDashboard(item);
    if(db !== null) {
        newItem._board = db;   
    }

    const priority = await getPriority(item);
    if(priority !== null) {
        newItem._priority = priority;
    }

    return newItem;
};

const getDescription = async (item) => {
    let description = new Array();
    for(const str of item) {
        if((str[0] === 'p' || str[0] === 'b') && str[1] === ':') {
            break;
        }
        description.push(str);
    }
    return description.join(' ').trim();
};

const getDashboard = async (item) => {
    const str = item.join(' ');
    let index = str.indexOf("b:");
    if(index === -1) {
        return null;
    }
    let board = new String();
    for(let i = index + 2 ; i < str.length ; i++) {
        if(str[i] === 'p' && str[i+1] === ':') {
            break;
        }
        board += str[i];
    }
    return board.trim();
};

const getPriority = async (item) => {
    const str = item.join(' ');
    let index = str.indexOf("p:");
    if(index === -1) {
        return null;
    }
    return str[index+2];
};

const getCurrBoardName = async (item) => {
    const str = item.join(' ');
    let index = str.indexOf("c:");
    let bName = new String();
    for(let i = index+2 ; i < str.length ; i++) {
        if(str[i] === 'n' && str[i+1] === ':') {
            break;
        }
        bName += str[i];
    }
    return bName.trim();
};

const getNewBoardName = async (item) => {
    const str = item.join(' ');
    let index = str.indexOf("n:");
    return str.substring(index+2).trim();
};

const multipleFlags = async () => {
    await messages.multiFlags();
};


module.exports = { 
    createTask, 
    createNote,
    removeItem,
    starItem,
    moveItem,
    markDone,
    editTask,
    eraseList,
    startTask,
    unpinItem,
    changeBoard,
    multipleFlags,
    changePriority,
    copyToClipboard,
};