#!/usr/bin/env node
'use strict';

const fs = require("fs");
const messages = require("./messages");
const pathConfig = require("./helpers/pathConfig");

const storeItem = async (task) => {
    if(!FileExist()) {
        await saveItemInFile([task], task, -1, "C");
    }
    else {
        const list = await getTaskList();
        list.push(task);
        await saveItemInFile(list, task, -1, "C");
    }
};

const deleteItem = async (index) => {
    let list = await getTaskList();
    list.splice(index, 1);
    for(let i = index ; i < list.length ; i++) {
        list[i]._id -= 1;
    }
    await saveItemInFile(list, {}, index+1, "D");
};

const updateCompleteStatus = async (index) => {
    let list = await getTaskList();
    list[index]._isComplete = !list[index]._isComplete;
    await saveItemInFile(list, {}, index+1, "U");
};

const updatePriority = async (index, p) => {
    let list = await getTaskList();
    list[index]._priority = p;
    await saveItemInFile(list, {}, index+1, "U");
};

const updateBoard = async (currName, newName) => {
    let list = await getTaskList();
    for(const task of list) {
        if(task._board === currName) {
            task._board = newName;
        }
    }
    await saveItemInFile(list, {}, -1, "UB");
};

const updateTask = async (ID, desc) => {
    let list = await getTaskList();
    list[ID]._description = desc;
    await saveItemInFile(list, {}, ID+1, "U");
};

const updateTaskBoard = async (ID, boardName) => {
    let list = await getTaskList();
    list[ID]._board = boardName;
    await saveItemInFile(list, {}, ID+1, "U");
};

const updateStarItem = async (ID) => {
    let list = await getTaskList();
    list[ID]._isStarred = !list[ID]._isStarred;
    await saveItemInFile(list, {}, ID+1, "U");
};

const updateList = async (list) => {
    await saveItemInFile(list, {}, -1, "UB");
};

const updateProgress = async (ID) => {
    let list = await getTaskList();
    list[ID]._inProgress = !list[ID]._inProgress;
    await saveItemInFile(list, {}, ID+1, "U");
};

const removeAll = async() => {
    await saveItemInFile([], {}, -1, "UB");
};


const saveItemInFile = async (task, ob, index, type) => {
    fs.writeFile(pathConfig.filePath, JSON.stringify(task), err => {
        if(err) throw err;
        if(type === "C") {
            messages.creation(ob);
        }
        if(type === "D") {
            messages.deletion(index);
        }
        if(type === "U") {
            messages.updation(index);
        }
        if(type === "UB") {
            messages.listUpdation();
        }
    });
};

const getTaskList = async () => {
    if(FileExist()) {
        return require(pathConfig.filePath);
    }
    return [];
};

const FileExist = () => {
     return fs.existsSync(pathConfig.filePath);
};

module.exports = {
    removeAll, 
    storeItem,
    deleteItem,
    getTaskList,
    updateList,
    updateTask,
    updateBoard,
    updateStarItem,
    updatePriority,
    updateProgress,
    updateTaskBoard,
    updateCompleteStatus
};